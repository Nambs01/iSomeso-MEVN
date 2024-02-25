const multer = require('multer')
const upload = multer({
  limits: {
    fileSize: 5000000
  },
  fileFilter(req, file, callBack){
    if(!file.originalname.match(/\.(jpg|png|jpeg)/)){
      return callBack(new Error('Please upload an image'))
    }
    callBack(undefined, true)
  }
})

module.exports = upload