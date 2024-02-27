const express = require('express')
require('./db/mongoose')

const userRouter = require('./router/user.router')
const messageRouter = require('./router/message.router')

const app =  express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(messageRouter)

app.listen(port, () => {
  console.log("Server is up on port", port);
})

