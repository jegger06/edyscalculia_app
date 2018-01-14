const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const db = require('../config/connection');

// Register a user
router.post('/register', (req, res) => {
    // Check if `account_username` is unique
    const username = req.body.account_username;
    let sql = 'SELECT * FROM tbl_account WHERE account_username = ?';
    db.query(sql, [username], (err, result) => {
      // If there is an error in the query
      if (err) {
        return res.json({
            success: false,
            message: 'Error in checking username. Please try again later.'
        });
      }
      // If it exists on the DB
      if (result.length >= 1) {
        return res.json({
            success: false,
            message: 'Username already exists. Please use another username.'
        });
      } else {
        // Go on and process the registration
        const name = req.body.account_name;
        const bday = req.body.account_bday;
        let password = req.body.account_password;
        const date_created = new Date();

        // encrypt the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            // Change raw password to hash
            password = hash;

            let sql = 'INSERT INTO tbl_account SET account_name = ?, account_bday = ?, account_username = ?, account_password = ?, account_date = ?, type_id = ?';
            // value for `type_id` is set to 2 because right now, 2 is assigned to 'user. change it if we will update this'
            db.query(sql, [name, bday, username, password, date_created, 2], (err, result) => {
                if (err) {
                  return res.json({
                    success: false,
                    message: 'Error in saving a new account. Please try again later.'
                  });
                }
                return res.json({
                  success: true,
                  message: `Account registered.`
                });
            });
          });
        });
      }
    });
});

router.get('/lists', (req, res) => {
    let sql = 'SELECT * FROM tbl_account';
    db.query(sql, (err, result) => {
        if (err) {
            console.log('Something wen\'t wrong fetching data from database...');
        }
        console.log(result);
        res.json({
            result
        });
    });
});

router.get('/:id', (req, res) => {
    let sql = 'SELECT * FROM tbl_account WHERE account_id = ?';
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            console.log('Error in fetching data...');
        }
        if (result.length < 1) {
            res.json({
                success: false,
                message: 'The person does not exist...',
                data: result.length
            });
        } else {
            res.json({
                success: true,
                message: 'Here is the details for this person...',
                result,
                data: result.length
            });
        }
    });
});

module.exports = router;