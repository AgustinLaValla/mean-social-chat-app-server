const User = require('../models/user.schema');
const Post = require('../models/post.schema');
const httpStatus = require('http-status-codes');
const moment = require('moment');
const { compare, genSalt, hash } = require('bcryptjs');

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .where('username')
            .ne(req.user.username)
            .populate('following.userFollowed', 'username picVersion picId city country img google')
            .populate('followers.follower', 'username picVersion picId city country img google')
            .populate('chatList.receiverId', 'username picVersion picId city country img google')
            .populate('chatList.msgId')
            .populate('notifications.senderId', 'picVersion picId img')
            .populate('posts.postId');
        return res.json({ ok: true, users });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: true, error: error.message });
    };
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) * -1;
    try {
        const user = await User.findOne({_id: id}, {
            posts: { $slice:  limit}
        })
            .populate('following.userFollowed', 'username picVersion picId city country img google')
            .populate('followers.follower', 'username picVersion picId city country img google')
            .populate('chatList.receiverId', 'username picVersion picId city country img google')
            .populate('chatList.msgId')
            .populate('notifications.senderId', 'picVersion picId img google')
            .populate('posts.postId');

        if (!user) return res.json({ ok: false, message: 'User Not Found' });

        const totalPosts = await Post.countDocuments({
            user: id
        });

        return res.json({ ok: true, user, totalPosts });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Internal server Error' });
    }

};

const getUserByUsername = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username: username })
            .populate('following.userFollowed', 'username picVersion picId img city country google')
            .populate('followers.follower', 'username picVersion picId img city country google')
            .populate('chatList.receiverId', 'username picVersion picId img city country google')
            .populate('chatList.msgId', 'message.body')
            .populate('notifications.senderId', 'picVersion picId img google')
            .populate({ path: 'posts.postId', model: 'Post' })

        if (!user) return res.json({ ok: false, message: 'User Not Found' });

        return res.json({ ok: true, user });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Internal server error' });
    }
};

const setUserLocation = async (req, res) => {
    try {
        const { city, country } = req.body;
        const user = await User.findById(req.user._id);
        user.city = city;
        user.country = country;
        await user.save();
        return res.json({ ok: true, message: 'User location successfully setted' });

    } catch (error) {
        console.log(error);
    }
};

const profileViewNotification = async (req, res) => {
    const { id } = req.body;
    const date = moment().format('YYYY-MM-DD');

    try {

        await User.updateOne({ _id: id }, {
            $push: {
                notifications: {
                    senderId: req.user._id,
                    message: `${req.user.username} has Viewed your Profile`,
                    date,
                    viewProfile: true
                }
            }
        }).where('notifications.date').and([{ date: { $ne: date } }, { date: { $ne: '' } }]);

        return res.json({ ok: true, message: 'Notification Sent' });

    } catch (error) {
        return res.json({ ok: false, message: 'Internal Server Error' });
    };

};

const changePassword = async (req, res) => {
    const { password, newPassword } = req.body;

    try {
        const user = await User.findById(req.user._id);

        const isValid = await compare(password, user.password);
        if (!isValid) return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ ok: false, message: 'Password is wrong!' });

        const salt = await genSalt(10);
        user.password = await hash(newPassword, salt);

        await user.save();

        return res.json({ ok: true, message: 'Password Successfully Changed' });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'Internal Server Error' });
    };

};

module.exports = { getUsers, getUserById, getUserByUsername, profileViewNotification, changePassword, setUserLocation };