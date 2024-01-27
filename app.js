const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const io = require('socket.io')(8080, {
    cors: {
        origin: 'http://localhost:3002',
    }
});

// Connect DB
require('./db/connection');

// Import Files
const Users = require('./models/users');
const Conversations = require('./models/Conversations');
const Messages = require('./models/Messages');

// app Use
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 8000;

// Socket.io
let users = [];
io.on('connection', socket => {
    console.log('User connected', socket.id);
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit('getUsers', users);
        }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await Users.findById(senderId);
        console.log('sender :>> ', sender, receiver);
        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, fullName: user.fullName, email: user.email }
            });
            }else {
                io.to(sender.socketId).emit('getMessage', {
                    senderId,
                    message,
                    conversationId,
                    receiverId,
                    user: { id: user._id, fullName: user.fullName, email: user.email }
                });
            }
        });

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
    });
    // io.emit('getUsers', socket.userId);
});

// Routes
app.get('/', (req, res) => {
    res.send('Welcome');
})

app.post('/api/Conversations', async (req, res, next) => {
    try {
        const { senderId, receiverId } = req.body;
        const newConversation = new Conversations({ members: [senderId, receiverId] });
        await newConversation.save();
        res.status(200).send('Conversation created successfully');
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/Conversations/:userId', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const conversations = await Conversations.find({ members: { $in: [userId] } });
        const conversationUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await Users.findById(receiverId);
            return { user: { receiverId: user._id, email: user.email, fullName: user.fullName }, conversationId: conversation._id }
        }));
        res.status(200).json(await conversationUserData);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/message', async (req, res, next) => {
    try {
        const { conversationId, senderId, message, receiverId = '' } = req.body;
        if (!senderId || !message) return res.status(400).send('Please fill all required fields');
        if (conversationId === 'new' && receiverId) {
            const newConversation = new Conversations({ members: [senderId, receiverId] });
            await newConversation.save();
            const newMessage = new Messages({ conversationId: newConversation._id, senderId, message });
            await newMessage.save();
            res.status(200).send('Message sent successfully');
        } else if (!conversationId && !receiverId) {
            res.status(400).send('Please fill all required fields');
        } else {
            const newMessage = new Messages({ conversationId, senderId, message });
            await newMessage.save();
            res.status(200).send('Message sent successfully');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/message/:conversationId', async (req, res, next) => {
    try {
        const checkMessages = async (conversationId) => {
            console.log(conversationId, 'conversationId');
            const messages = await Messages.find({ conversationId });
            const messageUserData = Promise.all(messages.map(async (message) => {
                const user = await Users.findById(message.senderId);
                return { user: { id: user._id, email: user.email, fullName: user.fullName }, message: message.message }
            }));
            res.status(200).json(await messageUserData);
        };

        const conversationId = req.params.conversationId;
        if (conversationId === 'new') {
            const checkConversation = await Conversations.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });
            if (checkConversation.length > 0) {
                checkMessages(checkConversation[0]._id);
            } else {
                res.status(200).json([]);
            }
        } else {
            checkMessages(conversationId);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/users/:userId', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const users = await Users.find({ _id: { $ne: userId } });

        const usersData = await Promise.all(users.map(async (user) => {
            return { user: { email: user.email, fullName: user.fullName, receiverId: user._id } };
        }));

        res.status(200).json(usersData);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});