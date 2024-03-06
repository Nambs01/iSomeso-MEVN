const User = require('../models/user')

const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()

    res.send()
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const logoutAll =  async (req, res) => {
  try {
    req.user.tokens = Array()
    await req.user.save()
    res.status(200).send('All logout!')
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
} 

module.exports = {
  login,
  logout,
  logoutAll
}