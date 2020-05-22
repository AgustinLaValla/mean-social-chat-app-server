const User = require('../models/user.schema');
const httpStatus = require('http-status-codes');

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
                           .populate('post.postId')
                           .populate('following.userFollowed', 'username')
                           .populate('followers.follower', 'username');

    if(!user) return res.json({ok:false, message:'User Not Found'});

    return res.json({ok:true, user});

};

const getUserByUsername = async (req, res) => {
    const { username } = req.params;
    console.log(username);
    const user = await User.findOne({username:username})
                           .populate('post.postId')
                           .populate('following.userFollowed', 'name')
                           .populate('followers.follower', 'name');

    if(!user) return res.json({ok:false, message:'User Not Found'});

    return res.json({ok:true, user});               
};

module.exports = { getUsers, getUserById, getUserByUsername };