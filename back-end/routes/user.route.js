const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../config/keys');

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
            // value for `type_id` is set to 2 because right now, 2 is assigned to 'user'. change it if we will update this
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

router.post('/login', (req, res) => {
  const username = req.body.account_username;
  const password = req.body.account_password;

  // Check if username exist in DB
  let sql = 'SELECT * FROM tbl_account AS a INNER JOIN tbl_type AS t ON a.type_id = t.type_id WHERE account_username = ? LIMIT 1';
  db.query(sql, [username], (err, result) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Error in checking user data. Please try again later.'
      });
    }
    if (!result.length) {
      return res.json({
        success: false,
        message: 'User not found. Please check the username field.'
      });
    }

    // username is correct. check if password match
    bcrypt.compare(password, result[0].account_password, (err, isMatch) => {

      if (err) {
        return res.json({
          success: false,
          message: 'Error in checking your password. Please try again later.'
        });
      }

      if (isMatch) {
        const user = {
          "account_id": result[0].account_id,
          "name": result[0].account_name,
          "username": result[0].account_username,
          "account_type": result[0].type_id
        }

        const token = jwt.sign(user, keys.secret, {
          expiresIn: 604800 // 1 week in seconds
        });

        return res.json({
          success: true,
          token: `Bearer ${token}`,
          user: result[0]
        });
      } else {
        return res.json({
          success: false,
          message: 'Password incorrect, please check your username and password.'
        });
      }
    });
  });
});

router.get('/lists', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    let sql = 'SELECT a.account_id, a.account_name, a.account_bday, a.account_username, a.account_date, a.type_id, t.type_description FROM tbl_account AS a INNER JOIN tbl_type AS t ON a.type_id = t.type_id ORDER BY ';
    let param_type = req.query.type;
    let param_date = req.query.date;
    switch(param_type) {
      case '1':
        sql += 'a.type_id ASC, ';
      break;
      case '2':
        sql += 'a.type_id DESC, ';
      break;
      default:
        sql += 'a.type_id ASC, ';
    }
    switch(param_date) {
      case '1':
        sql += 'a.account_date DESC';
      break;
      case '2':
        sql += 'a.account_date ASC';
      break;
      default:
        sql += 'a.account_date DESC';
    }
    db.query(sql, (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong fetching accounts in DB. Please try again later.'
        });
      }
      return res.json({
        success: true,
        accounts: result
      });
    })
  } else {
    return res.json({
      success: false,
      message: 'You don\'t have the rights to view the lists of users.'
    })
  }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const id = req.params.id;
  let sql = 'SELECT a.account_id, a.account_name, a.account_bday, a.account_username, a.account_date, a.type_id, t.type_description FROM tbl_account AS a INNER JOIN tbl_type AS t ON a.type_id = t.type_id WHERE a.account_id = ? LIMIT 1';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Something wen\'t wrong fetching user details. Please try again later.'
      });
    }

    return res.json({
      success: true,
      details: result[0]
    });
  });
});

// Update account
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const id = req.params.id;
  if (req.user.type_slog === 'admin' || req.user.account_id == id) {
    let sql = 'SELECT account_name FROM tbl_account WHERE account_id = ? LIMIT 1';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Error in checking if account exists. Please try again later.'
        });
      }

      if (!result.length) {
        return res.json({
          success: false,
          message: 'No account fetch. Please don\'t edit the URL.'
        });
      } else {
        const type_id = req.body.type_id;
        const account_name = req.body.account_name;
        const account_bday = req.body.account_bday;
        let sql = 'UPDATE tbl_account SET type_id = ?, account_name = ?, account_bday = ?';
        let password = '';
        if (req.body.account_password) {
          password = req.body.account_password;
          let salt = bcrypt.genSaltSync(10);
          password = bcrypt.hashSync(password, salt);
          sql += ', account_password = "' + password + '" ';
        } else {
          sql += ' ';
        }
        sql += 'WHERE account_id = ?';
        db.query(sql, [type_id, account_name, account_bday, id], (err, result) => {
          if (err) {
            return res.json({
              success: false,
              message: 'Error in updating account. Please try again.'
            });
          }

          res.json({
            success: true,
            message: 'Account has been updated.'
          });
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to update this account.'
    });
  }
});

// Delete an account
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    const id = req.params.id;
    const user_id = req.user.account_id;
    if (user_id == id) {
      return res.json({
        success: false,
        message: 'You can\'t delete your own account.'
      });
    } else {
      let sql = 'DELETE FROM tbl_account WHERE account_id = ?';
      db.query(sql, [id], (err, result) => {
        if (err) {
          return res.json({
            success: false,
            message: 'You can\'t delete the account because there are still attached to it. Delete the chapters, lessons, questions attached to this account before deleting this account.'
          });
        }
        
        if (!result.affectedRows) {
          return res.json({
            success: false,
            message: 'The account does not exist. Please don\'t edit the URL.',
          });
        } else {
          return res.json({
            success: true,
            message: 'Account has been deleted.',
          });
        }
      });
    }
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to delete an account.'
    });
  }
});

module.exports = router;