const express = require('express')
const Message = require('../models/message')
const auth = require('../middleware/auth')
const { default: mongoose } = require('mongoose')
const router = express.Router()

// Dernier message par chaque utilisateur
router.get('/messages', auth, async (req, res) => {
  try {
    const message = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: req.user._id },
            { to: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$from", req.user._id]},
              "$to",
              "$from"
            ]
          },
          latestMessage: { $first: "$$ROOT"}
        }
      },
      {
        $replaceRoot: { newRoot: "$latestMessage" }
      }
    ])
    res.send(message)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Discussion avec un utilisateur (tous les messages)
router.get('/messages/:id', auth, async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: _id },
        { from: _id, to: req.user._id }
      ]
    }).sort({ createdAt: -1 }).exec()
    
    // modifier tous les messages envoyer par l'autre utilisateur en vue
    messages.forEach((message) => {
      if (message.from == req.params.id && !message.vue) {
        message.vue = true
        message.save()
      }
    });
    
    res.send(messages)
  } catch (error) {
    res.status(400).send(error)
  }
})

// envoyer un message
router.post('/messages', auth, (req, res) => {
  const message = new Message({
    ...req.body,
    from: req.user._id
  })

  message.save().then(() => {
    res.status(201).send(message)
  }).catch((e) => {
    res.status(400).send(e)
  })
})


router.delete('/messages/:id', auth, async (req, res) => {
  try {
   const message = await Message.findOneAndDelete({ _id: req.params.id, from: req.user._id})
   
   if(!message){
    return res.status(404).send()
   }
   res.send(message)
  } catch (error) {
    res.status(500).send()
  }
})

module.exports = router