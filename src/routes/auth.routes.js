const { Router } = require('express');
const { createUser, login, googleLogin } = require('../controllers/auth.controller');

const router = Router();

router.post('/register', createUser);
router.post('/login', login);
router.post('/google-login', googleLogin);

module.exports = router;