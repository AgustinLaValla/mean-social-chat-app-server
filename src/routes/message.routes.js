const { Router } = require('express');
const { verifyToken } = require('../middlewares/authentication');
const { sendMessage, getAllMessages, markReceiverMessages, markAllMessages} = require('../controllers/message.controller');

const router = Router();

router.get('/:senderId/:receiverId', verifyToken, getAllMessages);

router.post('/:senderId/:receiverId', verifyToken, sendMessage);

router.put('/mark/:sender/:receiver', verifyToken, markReceiverMessages);

router.put('/mark-all-messages', verifyToken, markAllMessages);

module.exports = router;