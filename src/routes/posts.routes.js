const { Router } = require('express');
const { addPost } = require('../controllers/posts.controller');
const { verifyToken } = require('../middlewares/authentication');

const router = Router();

router.post('/add-post', verifyToken ,addPost)

module.exports = router;