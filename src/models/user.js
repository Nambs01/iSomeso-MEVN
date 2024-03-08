const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name : {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value){
      if(value.toLowerCase().includes('password')){
        throw new Error('Password cannot contain "password"')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: String
  }
}, {
  timestamps: true
})

// Filtrer les reponses 
userSchema.methods.toJSON = function () { 
  const user = this
  const userObject = user.toObject()
  
  delete userObject.password
  delete userObject.tokens

  return userObject
}

// Generer un token
userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ 
    _id: user._id,
    exp: Math.floor(Date.now() / 1000) + 3600 * 48
   }, process.env.TOKEN_SECRET_KEY)
  
  user.tokens = user.tokens.concat({token})
  await user.save()

  return token
}

// Verifier le mot de passe
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({email})
  
  if (!user) {
    throw new Error ('Unable email')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  
  if (!isMatch) {
    throw new Error ('Unable password')
  }
  return user
}

// Hasher le mot de passe
userSchema.pre('save', async function (next) {
  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User