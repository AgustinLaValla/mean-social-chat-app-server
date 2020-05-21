const { Router }  = require('express');
const { verifyToken } = require('../middlewares/authentication');
const { follow } = require('../controllers/friends.controller');

const router = Router();

router.put('/follow-user', verifyToken, follow);

module.exports = router;