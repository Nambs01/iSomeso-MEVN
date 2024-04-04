const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

    if(!user){
      throw Error ('Unable token!')
    }
    req.token = token
    req.user = user
    next()
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate!' })
  }
}

module.exports = auth