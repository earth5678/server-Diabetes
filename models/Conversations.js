const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const conversationSchema = mongoose.Schema({
    members: {
        type: Array,
        required: true,
    }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;