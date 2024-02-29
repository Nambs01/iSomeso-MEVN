require('./db/connectDB')
require('dotenv').config()
const express = require('express')
const accessAPI = require('./config/accessAPI')

const userRouter = require('./router/user.router')
const messageRouter = require('./router/message.router')

const app =  express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(accessAPI)
app.use(userRouter)
app.use(messageRouter)

app.listen(port, () => {
  console.log("Server is up on port", port);
})

