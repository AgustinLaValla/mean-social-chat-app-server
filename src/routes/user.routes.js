const { Router }  = require('express');
const { verifyToken } = require('../middlewares/authentication');
const { getUsers, getUserById, getUserByUsername, profileViewNotification, changePassword, setUserLocation } = require('../controllers/user.controllers');

const router = Router();

router.get('/', verifyToken, getUsers);

router.get('/:id', verifyToken, getUserById);

router.get('/get-user/:username', verifyToken, getUserByUsername);

router.put('/view-profile', verifyToken, profileViewNotification);

router.put('/change-password', verifyToken, changePassword);

router.put('/set-location', verifyToken, setUserLocation);

module.exports = router;