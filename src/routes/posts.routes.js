const { Router } = require('express');
const { addPost, getAllPost, addLike, addComment, getSinglePost } = require('../controllers/posts.controller');
const { verifyToken } = require('../middlewares/authentication');

const router = Router();

router.get('/', verifyToken, getAllPost);

router.get('/:id', verifyToken, getSinglePost);

router.post('/add-post', verifyToken ,addPost);

router.post('/add-post-like', verifyToken, addLike);

router.post('/add-comment', verifyToken, addComment);

module.exports = router;