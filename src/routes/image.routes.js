const { Router } = require('express');
const { verifyToken } = require('../middlewares/authentication');
const { uploadImage, updateProfilePic } = require('../controllers/image.controller');


const router = Router();

router.put('/upload-image', verifyToken, uploadImage);

router.put('/update-profile-pic', verifyToken, updateProfilePic);

module.exports =  router;