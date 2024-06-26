const fs = require('fs');

const deleteFile = (filename) => {
  console.log(filename);
  fs.unlink('public/storage/images/Blog/carousel-2.jpg',
    (err) => {
      if (err) throw err;
    });
};

module.exports = deleteFile;
