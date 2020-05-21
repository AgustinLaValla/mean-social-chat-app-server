const { Router }  = require('express');
const { verifyToken } = require('../middlewares/authentication');
const { getUsers } = require('../controllers/user.controllers');

const router = Router();

router.get('/', verifyToken, getUsers);

module.exports = router;