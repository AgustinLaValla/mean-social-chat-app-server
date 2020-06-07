const User = require('../models/user.schema');
const httpStatus = require('http-status-codes');
const moment = require('moment');
const {compare, genSalt, hash} = require('bcryptjs');

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
                                .where('username')
                                .ne(req.user.username)
                                .populate('post.postId')
                                .populate('following.userFollowed', 'username')
                                .populate('followers.follower', 'username');
        return res.json({ ok: true, users });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: true, error: error.message });
    };
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
                           .populate('following.userFollowed', 'username picVersion picId city country')
                           .populate('followers.follower', 'username picVersion picId city country')
                           .populate('chatList.receiverId', 'username picVersion picId city country')
                           .populate('chatList.msgId')
                           .populate('notifications.senderId', 'picVersion picId')
                           .populate('posts.postId');

    if(!user) return res.json({ok:false, message:'User Not Found'});

    return res.json({ok:true, user});

};

const getUserByUsername = async (req, res) => {
    const { username } = req.params;
    console.log(username);
    const user = await User.findOne({username:username})
                           .populate('following.userFollowed', 'username picVersion picId city country')
                           .populate('followers.follower', 'username picVersion picId city country')
                           .populate('chatList.receiverId', 'username picVersion picId city country')
                           .populate('chatList.msgId', 'message.body')
                           .populate('notifications.senderId', 'picVersion picId')
                           .populate({path:'posts.postId', model:'Post'})

    if(!user) return res.json({ok:false, message:'User Not Found'});

    return res.json({ok:true, user});               
};

const profileViewNotification = async (req, res) => {
    const { id } = req.body;
    const date = moment().format('YYYY-MM-DD');

    try {

        await User.updateOne({_id:id}, {$push:{
            notifications: { 
                senderId: req.user._id,
                message: `${req.user.username} has Viewed your Profile`,
                date,
                viewProfile:true
            }
        }}).where('notifications.date').and([{ date: {$ne:date} }, {date: {$ne: ''}}]);
    
        return res.json({ok:true, message:'Notification Sent'});
        
    } catch (error) {
        console.log(error);
        return res.json({ok:false, message:'Internal Server Error'});
    };

};

const changePassword = async (req, res) => {
    const { password, newPassword } = req.body; 

    try {
        const user = await User.findById(req.user._id);
        
        const isValid = await compare(password, user.password);
        if(!isValid) return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ok:false, message:'Password is wrong!'});
        
        const salt = await genSalt(10);
        user.password = await hash(newPassword, salt);
        
        await user.save();
        
        return res.json({ok:true, message:'Password Successfully Changed'});
        
    } catch (error) {
        console.log(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ok:false, message:'Internal Server Error'});
    };
    
};

module.exports = { getUsers, getUserById, getUserByUsername, profileViewNotification, changePassword };