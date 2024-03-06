const Message = require('../models/message')
const { ObjectId } = require('mongoose').Types
// Dernier message par chaque utilisateur

const getLastMessages = async (req, res) => {
  try {
    const userId = req.user._id
    let users = []

    // Trouver tous les utilisateurs avec qui l' utilisateur actuel a eu une conversation
    const fromUsers = await Message.distinct('from', { to: userId })
    const toUsers = await Message.distinct('to', { from: userId })

    fromUsers.forEach(user => users.push(user))
    toUsers.forEach(user => users.push(user))

    // Supprimer les doublons
    users = [...new Set(users)] 

    // Recuperer les derniers messages pour chaque utilisateur
    const messages = await Promise.all( users.map( async (otherUserId) => {
      return await Message.find({
        $or: [
          { from: userId, to: otherUserId },
          { from: otherUserId, to: userId }
        ]
      }).sort({ createdAt: -1 }).limit(1).populate(['to', 'from']).exec()
    }))
    res.send({ messages: messages })
  } catch (error) {
    res.status(500).send({ error: error })
  }
}

// Discussion avec un utilisateur (tous les messages)

const getMessages = async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id)
    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: req.params.id },
        { from: req.params.id, to: req.user._id }
      ]
    }).sort({ createdAt: -1 }).populate(['to', 'from']).exec();
    
    // modifier tous les messages envoyer par l'autre utilisateur en vue
    messages.forEach((message) => {
      if (message.from == req.params.id && !message.vue) {
        message.vue = true
        message.save()
      }
    })
    res.send({ messages: messages })
  } catch (error) {
    res.status(400).send({ error: error })
  }
}

const sendMessage = (req, res) => {
  const message = new Message({
    ...req.body,
    from: req.user._id
  })

  message.save().then(() => {
    res.status(201).send({ messages: message })
  }).catch((error) => {
    res.status(400).send({ error: error })
  })
}

const deleteMessage = async (req, res) => {
  try {
   const message = await Message.findOneAndDelete({ _id: req.params.id, from: req.user._id})
   
   if(!message){
    return res.status(404).send({ error: "Message invalide" })
   }
   res.send({ messages: message })
  } catch (error) {
    res.status(500).send({ error: error })
  }
}

module.exports = {
  getLastMessages,
  getMessages,
  sendMessage,
  deleteMessage
}