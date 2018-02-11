const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../config/connection');

// Adding a difficulty
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    db.getConnection((err, connection) => {
      if (err) {
          connection.release();
          return res.json({
          success: false,
          message: 'Can\' connect to DB right now. Please try again later.'
          });
      }

      const slog = req.body.difficulty_slog;
      let sql = 'SELECT difficulty_id FROM tbl_difficulty WHERE difficulty_slog = ? LIMIT 1';
      connection.query(sql, [slog], (err, result) => {
        if (err) {
          connection.release();
          return res.json({
            success: false,
            message: 'Error in checking if there is a duplicate. Please try again later.'
          });
        }
  
        if (result.length) {
          connection.release();
          return res.json({
            success: false,
            message: 'Difficulty already exists. Please try again.'
          });
        } else {
          const account_id = req.user.account_id;
          const text = req.body.difficulty_text;
          const date_created = new Date();
          let sql = 'INSERT INTO tbl_difficulty SET account_id = ?, difficulty_slog = ?, difficulty_text = ?, difficulty_date = ?';
          connection.query(sql, [account_id, slog, text, date_created], (err, result) => {
            connection.release();
            if (err) {
              return res.json({
                success: false,
                message: 'Error in inserting a difficulty. Please try again later.'
              });
            }
  
            return res.json({
              success: true,
              message: 'Difficulty has been added.',
              difficulty_id: result.insertId
            });
          });
        }
      });
    });
  } else {
    return res.json({
      success: false,
      message: 'You don\'t have the rights to create a difficulty.'
    })
  }
});

// List of difficulty
router.get('/lists', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
        connection.release();
        return res.json({
        success: false,
        message: 'Can\' connect to DB right now. Please try again later.'
        });
    }

    let sql = 'SELECT d.difficulty_id, d.account_id, d.difficulty_slog, d.difficulty_text, d.difficulty_date, a.account_name, a.account_username FROM tbl_difficulty AS d INNER JOIN tbl_account AS a ON d.account_id = a.account_id ORDER BY d.difficulty_date DESC';
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) {
        return res.json({
          success: false,
          message: 'Error in fetching difficulties. Please try again later.'
        });
      }
  
      if (!result.length) {
        return res.json({
          success: false,
          message: 'No difficulties found on DB. Please add a difficulty.'
        });
      } else {
        return res.json({
          success: true,
          difficulties: result
        });
      }
    });
  
  });
  
});

// Difficulty Details
router.get('/:id', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
        connection.release();
        return res.json({
        success: false,
        message: 'Can\' connect to DB right now. Please try again later.'
        });
    }

    const id = req.params.id;
    let sql = 'SELECT d.difficulty_id, d.account_id, d.difficulty_slog, d.difficulty_text, d.difficulty_date, a.account_name, a.account_username FROM tbl_difficulty AS d INNER JOIN tbl_account AS a ON d.account_id = a.account_id WHERE difficulty_id = ?';
    connection.query(sql, [id], (err, result) => {
      connection.release();
      if (err) {
        return res.json({
          success: false,
          message: 'Error in fetching difficulty details. Please try again later.'
        });
      }
  
      if (!result.length) {
        return res.json({
          success: false,
          message: 'No details found for this difficulty. Please don\'t edit the URL.'
        });
      } else {
        return res.json({
          success: true,
          details: result[0]
        });
      }
    });
  
  });
  
});

// Update a Difficulty
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    db.getConnection((err, connection) => {
      if (err) {
          connection.release();
          return res.json({
          success: false,
          message: 'Can\' connect to DB right now. Please try again later.'
          });
      }

      const id = req.params.id;
      let sql = 'SELECT difficulty_text FROM tbl_difficulty WHERE difficulty_id = ? LIMIT 1';
      connection.query(sql, [id], (err, result) => {
        if (err) {
          connection.release();
          return res.json({
            success: false,
            message: 'Error in checking the difficulty to update. Please try again later.'
          });
        }
  
        if (!result.length) {
          connection.release();
          return res.json({
            success: false,
            message: 'The difficulty does not exist. Please don\'t edit the URL.'
          });
        } else {
          // Check if the lesson exists in DB
          const slog = req.body.difficulty_slog;
          let sql = 'SELECT difficulty_id FROM tbl_difficulty WHERE difficulty_slog = ? LIMIT 1';
          connection.query(sql, [slog], (err, result) => {
            if (err) {
              connection.release();
              return res.json({
                success: false,
                message: 'Something wen\'t wrong in checking for duplicate. Please try again later.'
              });
            }
  
            if ((result[0] && result[0].difficulty_id == id) || !result.length) {
              const text = req.body.difficulty_text;
              let sql = 'UPDATE tbl_difficulty SET difficulty_slog = ?, difficulty_text = ? WHERE difficulty_id = ?';
              connection.query(sql, [slog, text, id], (err, result) => {
                connection.release();
                if (err) {
                  return res.json({
                    success: false,
                    message: 'Error in updating the difficulty. Please try again later.'
                  });
                }
  
                return res.json({
                  success: true,
                  message: 'Difficulty has been updated.'
                });
              });
            } else {
              connection.release();
              return res.json({
                success: false,
                message: 'Difficulty already exists. Please check the list of difficulties.'
              });
            }
          });
        }
      });
    });
  } else {
    return res.json({
      success: false,
      message: 'You don\'t have the rights to update a difficulty.'
    })
  }
});

// Delete a difficulty
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    db.getConnection((err, connection) => {
      if (err) {
          connection.release();
          return res.json({
          success: false,
          message: 'Can\' connect to DB right now. Please try again later.'
          });
      }
    
      const id = req.params.id;
      let sql = 'SELECT difficulty_text FROM tbl_difficulty WHERE difficulty_id = ? LIMIT 1';
      connection.query(sql, [id], (err, result) => {
        if (err) {
          connection.release();
          return res.json({
            success: false,
            message: 'Error in finding the difficulty to delete. Please try again later.'
          });
        }
  
        if (!result.length) {
          connection.release();
          return res.json({
            success: false,
            message: 'The difficulty does not exist. Please don\'t edit the URL.'
          });
        } else {
          let sql = 'DELETE FROM tbl_difficulty WHERE difficulty_id = ?';
          connection.query(sql, [id], (err, result) => {
            connection.release();
            if (err) {
              return res.json({
                success: false,
                message: 'There are still questions attached to this difficulty. Please delete the questions attached to this difficulty before deleting this.'
              });
            }
  
            return res.json({
              success: true,
              message: 'Difficulty has been deleted.'
            });
          });
        }
      });
    });
  } else {
    return res.json({
      success: false,
      message: 'You don\'t have the rights to delete a difficulty.'
    })
  }
});

module.exports = router;