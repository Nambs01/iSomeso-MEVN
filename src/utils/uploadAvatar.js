const { promises, writeFileSync, existsSync, rmdir } = require('fs')

const generateString = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const getBase64FileExtension = (file) => {
  const fileType = file.split(';')[0].split(':')[1];
  switch (fileType) {
      case 'image/bmp':
          return 'bmp';
      case 'image/gif':
          return 'gif';
      case 'image/x-icon':
          return 'ico';
      case 'image/jpeg':
          return 'jpeg';
      case 'image/png':
          return 'png';
      case 'image/svg+xml':
          return 'svg';
      case 'image/tiff':
          return 'tiff';
      case 'image/webp':
          return 'webp';
      case 'image/webp':
          return 'webp';
  }
  return ''
}

const uploadAvatar = async ({ dir, base64 }) => {
  const fileName = generateString(25) + "." + getBase64FileExtension(base64);
  
  const filePath = path.join(__dirname, '../../public/images', dir);

  try {
      // Supprimer le répertoire s'il existe 
      if(existsSync(filePath))
        rmdir(filePath)

      await promises.mkdir(filePath, { recursive: true });
      
      const base64Data = base64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
      writeFileSync(`${filePath}/${fileName}`, base64Data, {
          encoding: 'base64',
          flag: 'w',
      });
      return `images/${dir}/${fileName}`;
  } catch (error) {
      throw error;
  }
}

module.exports = uploadAvatar