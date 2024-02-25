const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
  text : {
    type: String,
    trim: true,
    required: true
  },
  vue : {
    type: Boolean,
    default: false
  },
  from : {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  to : {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

const Message = mongoose.model('message', messageSchema)

module.exports = Message