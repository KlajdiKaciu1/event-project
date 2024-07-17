const fs = require('fs');
const uploadPhotos = (req,res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const {path,originalname} = req.files[i];
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
      uploadedFiles.push(newPath.replace('uploads/',''));
    }
    res.json(uploadedFiles);
  }

  module.exports={uploadPhotos}