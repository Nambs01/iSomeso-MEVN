const User = require('../models/user')
const sharp = require('sharp')
const { promises, readFile } = require('fs')

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
    await promises.rmdir(req.user.avatar, { recursive: true})
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const getUserAvatar = async (req, res) => {
    const user = await User.findById(req.params.id)
    
    if(!user || !user.avatar){
      return res.send({error: 'Not have avatar!'})
    }
    
    const extension = (user.avatar).split(".")[1]
    
    readFile(user.avatar, async (error, data) => {
      if(error)
        return res.status(400).send({ error: error.message })

      const avatarFormat = await sharp(data).resize({ width: 128, height: 128 }).toBuffer()
      res.send({
        avatar: {
          base64: avatarFormat.toString('base64'),
          type: extension
        }
      })
    })
  
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