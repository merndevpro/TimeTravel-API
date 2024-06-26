/* eslint-disable consistent-return */
const express = require('express');
const uploadFile = require('../../utils/multer');
const deleteFile = require('./file.services');
const { isAuthenticated } = require('../../middlewares');

const router = express.Router();

router.delete('/delete', async (req, res) => {
  try {
    // eslint-disable-next-line eqeqeq
    if (req.body.filename == undefined) {
      return res.status(400).send({ message: 'filename was undefined!' });
    }

    await deleteFile(req.body.filename);

    res.status(200).send({
      message: `The following file was deleted successfully: ${req.filename}`,
    });
  } catch (err) {
    res.status(500).send({
      message: `Unable to delete the file: ${req.filename}. ${err}`,
    });
  }
});

router.post('/upload', isAuthenticated, async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file === undefined) {
      return res.status(400).send({ message: 'Upload a file please!' });
    }

    res.status(200).send({
      message: `The following file was uploaded successfully: ${req.file.originalname}`,
      path: `${process.env.BASEURL}${req.file.destination.split('public').join('')}/${req.file.filename}`
    });
  } catch (err) {
    // eslint-disable-next-line eqeqeq
    if (err.code == 'LIMIT_FILE_SIZE') {
      return res.status(500).send({
        message: 'File larger than 2MB cannot be uploaded!',
      });
    }
    res.status(500).send({
      message: `Unable to upload the file: ${req.file.originalname}. ${err}`,
    });
  }
});

module.exports = router;
