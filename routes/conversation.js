const express = require('express');
const router = express.Router();

const Conversations = require("../models/Conversations");
const Messages = require("../models/Messages");
const User = require("../models/user");

router.post('/conversation', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newCoversation = new Conversations({ members: [senderId, receiverId] });
    await newCoversation.save();
    res.status(200).send('Conversation created successfully');
  } catch (error) {
    console.log(error, 'Error')
  }
})

router.get('/conversations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({ members: { $in: [userId] } });

    const conversationUserData = await Promise.all(conversations.map(async (conversation) => {
      const receiverId = conversation.members.find((member) => member !== userId);
      const user = await User.findById(receiverId); // <-- Error is likely here
      if (!user) {
        return null;
      }
      return { user: { receiverId: user._id, email: user.email, fullName: user.fullName, image: user.image }, conversationId: conversation._id };
    }));
    const validConversations = conversationUserData.filter(conversation => conversation !== null);
    res.status(200).json(validConversations);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/message', async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId } = req.body;

    if (!senderId || !message) return res.status(400).send('Please fill all required fields')
    if (conversationId === 'new' && receiverId) {
      const newCoversation = new Conversations({ members: [senderId, receiverId] });
      await newCoversation.save();
      const newMessage = new Messages({ conversationId: newCoversation._id, senderId, message });
      await newMessage.save();
      return res.status(200).send('Message sent successfully');
    } else if (!conversationId && !receiverId) {
      return res.status(400).send('Please fill all required fields');
    }
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.log(error, 'Error')
  }
})
router.get('/message/:conversationId', async (req, res) => {
  try {
      const checkMessages = async (conversationId) => {
          console.log(conversationId, 'conversationId')
          const messages = await Messages.find({ conversationId });
          const messageUserData = Promise.all(messages.map(async (message) => {
              const user = await User.findById(message.senderId);
              return { user: { id: user._id, email: user.email, fullName: user.fullName }, message: message.message }
          }));
          res.status(200).json(await messageUserData);
      }

      const conversationId = req.params.conversationId;

      if (conversationId === 'new' && req.query.senderId && req.query.receiverId) {
          const checkConversation = await Conversations.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });
          if (checkConversation.length > 0) {
              checkMessages(checkConversation[0]._id);
          } else {
              return res.status(200).json([]);
          }
      } else if (conversationId !== 'new') {
          checkMessages(conversationId);
      } else {
          return res.status(400).send('Invalid request');
      }
  } catch (error) {
      console.log('Error', error);
      res.status(500).send('Internal Server Error');
  }
});

router.get('users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ _id: { $ne: userId } });
    const usersData = Promise.all(users.map(async (user) => {
      return { user: { email: user.email, fullName: user.fullName, receiverId: user._id } }
    }))
    res.status(200).json(await usersData);
  } catch (error) {
    console.log('Error', error)
  }
})

module.exports = router;
