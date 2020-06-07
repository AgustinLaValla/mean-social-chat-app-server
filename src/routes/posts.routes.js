const { Router } = require('express');
const { addPost, getAllPost, addLike, addComment, getSinglePost, getTopPosts, editPost, deletePost } = require('../controllers/posts.controller');
const { verifyToken } = require('../middlewares/authentication');

const router = Router();

router.get('/', verifyToken, getAllPost);

router.get('/:id', verifyToken, getSinglePost);

router.get('/top/get-all', verifyToken, getTopPosts);

router.post('/add-post', verifyToken ,addPost);

router.post('/add-post-like', verifyToken, addLike);

router.post('/add-comment', verifyToken, addComment);

router.put('/edit-post', verifyToken,editPost);

router.delete('/delete-post/:id', verifyToken,deletePost);

module.exports = router;