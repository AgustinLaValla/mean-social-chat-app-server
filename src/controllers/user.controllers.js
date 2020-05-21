const User = require('../models/user.schema');
const httpStatus = require('http-status-codes');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().where('username').ne(req.user.username).populate('post.postId');
        return res.json({ ok: true, users });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ok: true, error: error.message });
    };
};

module.exports = { getUsers };