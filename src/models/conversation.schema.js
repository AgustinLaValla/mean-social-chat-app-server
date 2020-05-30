const { Schema, model } = require('mongoose');

const conversationSchema = new Schema({
    participants: [
        {
            senderId: { type:Schema.Types.ObjectId, ref: 'User', required:true },
            receiverId: { type:Schema.Types.ObjectId, ref: 'User', required:true }
        }
    ]
});

module.exports = model('Conversation', conversationSchema);
