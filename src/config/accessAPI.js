const cors = require('cors')

const corsOption = {
  origin: "*"
}

module.exports = cors(corsOption)