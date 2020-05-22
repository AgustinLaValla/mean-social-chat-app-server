const { Router }  = require('express');
const { verifyToken } = require('../middlewares/authentication');
const { follow, unfollowUser } = require('../controllers/friends.controller');

const router = Router();

router.put('/follow-user', verifyToken, follow);

router.put('/unfollow-user', verifyToken, unfollowUser);

module.exports = router;