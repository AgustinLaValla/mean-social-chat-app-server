const Post = require('../models/post.schema');
const Joi = require('@hapi/joi');
const HttpStatus = require('http-status-codes');
const User = require('../models/user.schema');
const cloudinary = require('cloudinary').v2
const moment = require('moment');
const request = require('request');

const addPost = async (req, res) => {

    try {
        const { body } = req;

        const schema = Joi.object().keys({ post: Joi.optional(), image: Joi.optional() });

        const { error } = schema.validate(body);

        if (error && error.details) return res.status(HttpStatus.BAD_REQUEST).json({ ok: false, message: error.details });

        let image = null;
        if (body.image) {
            const result = await cloudinary.uploader.upload(body.image);
            image = result.url;
        };

        const postPaylaod = { user: req.user._id, username: req.user.username, post: body.post, created: new Date, image };

        const post = await Post.create(postPaylaod);


        await User.updateOne({ _id: req.user._id }, {
            $push: {
                posts: {
                    postId: post._id,
                    post: body.post,
                    created: new Date()
                }
            }
        });

        return res.status(HttpStatus.CREATED).json({ ok: true, message: 'Post Successfully created', post });

    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An error has occured :(' });
    };

};

const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('user').sort({ createdAt: -1 });

        const user = await User.findById(req.user._id);
        if (user) {
            request({ url: 'https://geolocation-db.com/json', json: true }, async (err, res, body) => {
                user.city = body.city;
                user.country = body.country_name
                await user.save();
            });
        };

        return res.json({ ok: true, posts });
    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An Error Has Ocurred' });
    };
};

const getSinglePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id).populate('user', 'username').populate('comments.userId', 'username');

        return res.json({ ok: true, post });

    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An Error Has Ocurred' });
    }
};

const getTopPosts = async (req, res) => {
    const today = moment().startOf('day');
    const tomorow = moment(today).add(1, 'days');
    try {
        const posts = await Post.find().and([
            { totalLikes: { $gt: 2 } },
            { createdAt: { $gt: today.toDate(), $lt: tomorow.toDate() } }
        ]).populate('user').exec();
        return res.json({ ok: true, posts });
    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An Error Has Ocurred' });
    };
};

const addLike = async (req, res) => {
    try {
        const postId = req.body._id;
        await Post.updateOne({ _id: postId, 'likes.username': { $ne: req.user.username } }, {
            $push: {
                likes: {
                    username: req.user.username,
                }
            },
            $inc: { totalLikes: 1 }
        });
        return res.json({ ok: true, message: 'You liked the post' });
    } catch (error) {
        console.log(error);
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
                    createdAt: new Date()
                }
            }
        });

        return res.json({ ok: true, message: 'Comment Successffully createed' });

    } catch (error) {
        console.log(error)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An Error Has Ocurred' });
    }
};

const editPost = async (req, res) => {
    const { id, post } = req.body;

    try {

        await Post.findByIdAndUpdate(id, { post });

        return res.json({ ok: true, message: 'Post successfully deleted' });

    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An Error Has Ocurred' });
    }

};

const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        await Post.findByIdAndDelete(id);

        await User.updateOne({ _id: req.user._id }, {
            $pull: {
                posts: {
                    postId: id
                }
            }
        });

        return res.json({ok:true, message:'Post Successfully deleted!'});
    } catch (error) {
        console.log(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, message: 'An Error Has Ocurred' });
    }
}

module.exports = { addPost, getAllPost, addLike, addComment, getSinglePost, getTopPosts, editPost, deletePost };