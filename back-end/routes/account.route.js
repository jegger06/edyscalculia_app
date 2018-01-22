const express = require('express');
const router = express.Router();
const db = require('../config/connection');

router.get('/lists', (req, res) => {
  let sql = 'SELECT * FROM tbl_type';
  db.query(sql, (err, result) => {
    if (err) {
      res.json({
        success: false,
        message: 'Error in fetching type of accounts in DB...'
      });
    }
    if (result.length < 1) {
      res.json({
        success: false,
        message: 'No accounts created yet in DB...'
      });
    } else {
      res.json({
        success: true,
        message: 'Here are the lists of accounts',
        result
      });
    }
  });
});

module.exports = router;