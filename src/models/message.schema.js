const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    conversationId: { type:Schema.Types.ObjectId, ref:'Conversation', required:true },
    sender: { type:String },
    receiver: { type:String },
    message: [
        {
            senderId: { type:Schema.Types.ObjectId, ref: 'User', required:true },
            receiverId: { type:Schema.Types.ObjectId, ref: 'User', required:true },
            sendername: { type:String, required:true },
            receivername: { type:String, required:true },
            body: { type:String, required:true },
            isRead: { type:Boolean, default:false },
            createdAt: { type:Date, default: Date.now() }
        }
    ]
});

module.exports = model('Message', messageSchema);
