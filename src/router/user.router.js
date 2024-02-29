const router = require('express').Router()
const AuthMiddleware = require('../middleware/auth.middleware')
const AuthController = require('../controllers/auth.controller')
const UserController = require('../controllers/user.controller')

/*================================
        AUTHENTIFICATION
==================================*/

router.post('/users/login', AuthController.login)

router.post('/users/logout', AuthMiddleware, AuthController.logout)

router.post('/users/logoutAll', AuthMiddleware, AuthController.logoutAll)

/*=========================
            USER
===========================*/

router.post('/users', UserController.createUser)

router.get('/users/me', AuthMiddleware, UserController.getUserInfo)

router.patch('/users/me', AuthMiddleware, UserController.updateUser)

router.delete('/users/me', AuthMiddleware, UserController.deleteUser)

/*============================
            AVATAR
==============================*/

router.post('/users/me/avatar', AuthMiddleware, UserController.updateUserAvatar)

router.delete('/users/me/avatar', AuthMiddleware, UserController.deleteUserAvatar)

router.get('/users/:id/avatar', UserController.getUserAvatar)

module.exports = router