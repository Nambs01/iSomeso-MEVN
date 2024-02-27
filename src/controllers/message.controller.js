const Message = require('../models/message')

// Dernier message par chaque utilisateur

const getLastMessages = async (req, res) => {
  try {
    const messages = await Message.aggregate([
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
    res.send(messages)
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
}

const sendMessage = (req, res) => {
  const message = new Message({
    ...req.body,
    from: req.user._id
  })

  message.save().then(() => {
    res.status(201).send(message)
  }).catch((e) => {
    res.status(400).send(e)
  })
}

const deleteMessage = async (req, res) => {
  try {
   const message = await Message.findOneAndDelete({ _id: req.params.id, from: req.user._id})
   
   if(!message){
    return res.status(404).send()
   }
   res.send(message)
  } catch (error) {
    res.status(500).send()
  }
}

module.exports = {
  getLastMessages,
  getMessages,
  sendMessage,
  deleteMessage
}