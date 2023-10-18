const multer = require('multer');
const { UPLOAD_DIR } = require('../../constants/common');

const multerConfig = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
  cb(null, file.originalname);
  }
});

const upload = multer({
  storage: multerConfig
});

module.exports = upload;