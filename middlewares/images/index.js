const multer = require("multer");

module.exports.uploadImage = (type) => {

  const storage = multer.diskStorage({
    destination:
      function (req, file, cb) {
        cb(null, `${__dirname}/../../images/${type}s`)
      },
    filename:
      function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
      }
  });

  let upload = multer({ storage: storage });
  return upload.single(type);
}

