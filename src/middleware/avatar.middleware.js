const { promises, existsSync, rmdir, unlink, readdir } = require('fs')

const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: async function (req, file, cb){
    const dirPath = path.join(__dirname, '../../public/images', 'user/' + req.user._id)

    if(existsSync(dirPath))
      await promises.rmdir(dirPath, { recursive: true})
    await promises.mkdir(dirPath, { recursive: true})
    req.user.avatarDirName = dirPath
    cb(null, dirPath)
  },
  filename: function (req, file, cb){
    const extension = path.extname(file.originalname)
    req.user.avatarFileName = Date.now()+extension
    cb(null, req.user.avatarFileName)
  }
})
const upload = multer({ storage: storage })

module.exports = upload.single('avatar')