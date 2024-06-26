const util = require('util');
const multer = require('multer');
const fs = require('fs');

const setFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const maxSize = 100 * 1024 * 1024;
const storage = multer.diskStorage({
  destination: (req, _, cb) => {
    const { directory } = req.body;
    const folder = `public/storage/images/${directory}`;
    setFolder(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const { userId } = req.payload;
    const { directory } = req.body;
    cb(null, directory === 'avatar' ? `${userId}.jpg` : file.originalname);
  },
});

const uploadFile = multer({
  storage,
  limits: { fileSize: maxSize },
}).single('file');

// create the exported middleware object
const uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
