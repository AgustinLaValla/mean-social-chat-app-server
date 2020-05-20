const Post = require('../models/post.schema');
const Joi = require('@hapi/joi');
const HttpStatus = require('http-status-codes');
const User = require('../models/user.schema');

const addPost = async (req, res) => {

    try {
        const { body } = req;

        const schema = Joi.object().keys({ post: Joi.string().required() });

        const { error } = schema.validate(body);

        if (error && error.details) return res.status(HttpStatus.BAD_REQUEST).json({ ok: false, message: error.details });

        const postPaylaod = { user: req.user._id, username: req.user.username, post: body.post, created: new Date };

        const post = await Post.create(postPaylaod);

        await User.updateOne({ _id: req.user._id }, {
            $push: {
                posts: {
                    postId: req.user._id,
                    post: body.post,
                    created: new Date()
                }
            }
        });

        return res.status(HttpStatus.CREATED).json({ ok: true, message: 'Post Successfully created', post });

    } catch (error) {

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An error has occured :(' });
    };

};

const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('user').sort({ created: -1 });
        return res.json({ ok: true, posts });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An Error Has Ocurred' });
    };
};

const getSinglePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id).populate('user', 'username').populate('comments.userId', 'username');

        return res.json({ ok: true, post });

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An Error Has Ocurred' });
    }
};

const addLike = async (req, res) => {
    try {
        const postId = req.body._id;
        await Post.updateOne({ _id: postId, 'likes.username': { $ne: req.user.username } }, {
            $push: {
                likes: {
                    username: req.body.username,
                }
            },
            $inc: { totalLikes: 1 }
        });
        return res.json({ ok: true, message: 'You liked the post' });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An Error Has Ocurred' });
    };
};

const addComment = async (req, res) => {
    const { postId, comment } = req.body;
    try {
        await Post.updateOne({ _id: postId }, {
            $push: {
                comments: {
                    userId: req.user._id,
                    username: req.user.username,
                    comment: comment,
                }
            }
        });

        return res.json({ ok: true, message: 'Comment Successffully createed' });

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An Error Has Ocurred' });
    }
};

module.exports = { addPost, getAllPost, addLike, addComment, getSinglePost };