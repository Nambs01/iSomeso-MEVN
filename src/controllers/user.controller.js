const User = require('../models/user')
const { promises, existsSync, rmdir, rm, unlink } = require('fs')
const path = require('path')


const getUserInfo = async (req, res) => {
  try {
    res.status(200).send({ user: req.user })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: {$ne: req.user._id.toString()} }).exec()
    res.status(200).send({ users: users })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const createUser = async (req, res) => {
  const user = new User(req.body)

  await user.save().then(() => {
    res.status(201).send(user)
  }).catch((e) => {
    res.status(400).send({ error: e.message })
  })
}

const updateUser = async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if(!isValidOperation){
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update])

    await req.user.save()
    res.send({ user: req.user })
  } catch (error) {
    return res.status(400).send({ error: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    await User.deleteOne(req.user)
    res.send({ user: req.user })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const updateUserAvatar = async (req, res) => {
  try {
    // Mettre a jour l'avatar de l'utilisateur
    req.user.avatar = req.user.avatarDirName+"\\"+req.user.avatarFileName
    await req.user.save()
    res.send({ user: req.user })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const deleteUserAvatar = async (req, res) => {
  try {
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const getUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    
    if(!user || !user.avatar){
      throw new Error()
    }
    res.set('Content-Type', 'image/jpg')
    res.send({ avatar: user.avatar })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

module.exports = {
  getUserInfo,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserAvatar,
  deleteUserAvatar,
  getUserAvatar
} 