const { Router }  = require('express');
const { verifyToken } = require('../middlewares/authentication');
const { follow, unfollowUser, markNotification, markAllNotifications } = require('../controllers/friends.controller');

const router = Router();

router.put('/follow-user', verifyToken, follow);

router.put('/unfollow-user', verifyToken, unfollowUser);

router.put('/mark-notification/:id', verifyToken, markNotification);

router.put('/mark-all', verifyToken, markAllNotifications);

module.exports = router;