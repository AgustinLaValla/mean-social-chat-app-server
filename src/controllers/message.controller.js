const httpStatus = require('http-status-codes');
const Conversation = require('../models/conversation.schema');
const Message = require('../models/message.schema');
const User = require('../models/user.schema');
const { updateChatList } = require('../helpers/helpers');

const getAllMessages = async (req, res) => {

    const { senderId, receiverId } = req.params;
    const limit = parseInt(req.query.limit) * - 1;

    const conversationId = await Conversation.findOne().or([
        {
            $and: [
                { 'participants.senderId': senderId },
                { 'participants.receiverId': receiverId }
            ]
        },
        {
            $and: [
                { 'participants.senderId': receiverId },
                { 'participants.receiverId': senderId }
            ]
        }
    ]).select('_id')

    if (conversationId) {
        const messages = await Message.find({ conversationId: conversationId._id }, {
            message: { $slice: limit }
        });

        const msg = await Message.findOne({ conversationId });
        const total = msg.message.length;

        return res.json({ ok: true, messages, total });
    };


};

const sendMessage = async (req, res) => {
    const { senderId, receiverId } = req.params;
    const { receivername, message } = req.body;

    try {
        const conversations = await Conversation.find().or([
            { participants: { $elemMatch: { senderId: senderId, receiverId: receiverId } } },
            { participants: { $elemMatch: { senderId: receiverId, receiverId: senderId } } }
        ]);

        let conversation;

        if (conversations.length > 0) {

            await Message.updateOne({ conversationId: conversations[0]._id }, {
                $push: {
                    message: {
                        senderId,
                        receiverId,
                        sendername: req.user.username,
                        receivername,
                        body: message
                    }
                }
            });
            const messageSent = await Message.findOne({ conversationId: conversations[0]._id })
            updateChatList(req, messageSent._id);
            return res.json({ ok: true, message: 'Message Sent' });
        } else {

            conversation = await Conversation.create({
                participants: [{ senderId, receiverId }]
            });


            const newMessage = await Message.create({
                conversationId: conversation._id,
                sender: req.user.username,
                receiver: receivername,
                message: [
                    {
                        senderId,
                        receiverId,
                        sendername: req.user.username,
                        receivername,
                        body: message
                    }
                ]
            });

            await User.updateOne({ _id: req.user._id }, {
                $push: {
                    chatList: {
                        $each: [
                            {
                                receiverId: receiverId,
                                msgId: newMessage._id
                            }
                        ],
                        $position: 0
                    }
                }
            });

            await User.updateOne({ _id: receiverId }, {
                $push: {
                    chatList: {
                        $each: [
                            {
                                receiverId: req.user._id,
                                msgId: newMessage._id
                            }
                        ]
                    }
                }
            });

            return res.json({ ok: true, message: 'Message Sent' });

        };
    } catch (error) {
        console.log(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Internal server Error' });
    };



};

const markReceiverMessages = async (req, res) => {
    const { sender, receiver } = req.params;
    const message = await Message.aggregate([
        { $unwind: '$message' },
        {
            $match: {
                $and: [{ 'message.sendername': receiver, 'message.receivername': sender }]
            }
        }
    ]);

    if (message.length > 0) {
        try {
            message.forEach(async (value) => {
                await Message.updateOne({ 'message._id': value.message._id }, { $set: { 'message.$.isRead': true } });
            });
            return res.json({ ok: true, message: 'Messages Marked as read' });
        } catch (error) {
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Internal server Error' });
        };
    };

};

const markAllMessages = async (req, res) => {
    try {
        const userMessages = await Message.aggregate().unwind('$message').match({ 'message.receivername': req.user.username });

        if (userMessages.length > 0) {
            userMessages.forEach(async (message) =>
                await Message.updateOne({ 'message._id': message.message._id }, { $set: { 'message.$.isRead': true } }));
        };

        return res.json({ ok: true, message: 'All Messages Successfully Updated' });
    } catch (error) {
        console.log(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Internal server Error' });
    };
};

module.exports = { sendMessage, getAllMessages, markReceiverMessages, markAllMessages };