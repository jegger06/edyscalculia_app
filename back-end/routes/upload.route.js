const express = require('express');
const router = express.Router();

const upload_image = require('../helpers/image_upload');
const upload_video = require('../helpers/video_upload');

router.post('/image_upload', (req, res) => {
  upload_image(req, (err, data) => {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }

    console.log(data);
    res.send(data);
  });
});

router.post('/video_upload', (req, res) => {
  upload_video(req, (err, data) => {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }
    
    console.log(data);
    res.send(data);
  });
});

module.exports = router;