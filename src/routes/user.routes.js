const { Router }  = require('express');
const { verifyToken } = require('../middlewares/authentication');
const { getUsers, getUserById, getUserByUsername } = require('../controllers/user.controllers');

const router = Router();

router.get('/', verifyToken, getUsers);

router.get('/:id', verifyToken, getUserById);

router.get('/get-user/:username', verifyToken, getUserByUsername);

module.exports = router;