const express = require('express')
const AuthMiddleware = require('../middleware/auth.middleware')
const MessageController = require('../controllers/message.controller')
const router = express.Router()

router.get('/messages', AuthMiddleware, MessageController.getLastMessages)

router.get('/messages/:id', AuthMiddleware, MessageController.getMessages)

router.post('/messages', AuthMiddleware, MessageController.sendMessage)

router.delete('/messages/:id', AuthMiddleware, MessageController.deleteMessage)

module.exports = router