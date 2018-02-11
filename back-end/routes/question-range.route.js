const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../config/connection');

// Create a question-range
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

      // Check if question range exist in DB
      const slog = req.body.question_range_slog;
      let sql = 'SELECT question_range_id FROM tbl_question_range WHERE question_range_slog = ? LIMIT 1';
      connection.query(sql, [slog], (err, result) => {
        if (err) {
          connection.release();
          return res.json({
            success: false,
            message: 'Something wen\'t wrong in checking for duplicate. Please try again later.'
          });
        }

        if (result.length) {
          connection.release();
          return res.json({
            success: false,
            message: 'Question range already exists. Please try again.'
          });
        } else {
          const adminId =  req.user.account_id;
          const from = req.body.question_range_from;
          const to = req.body.question_range_to;
          let sql = 'INSERT INTO tbl_question_range SET account_id = ?, question_range_slog = ?, question_range_from = ?, question_range_to = ?';
          connection.query(sql, [adminId, slog, from, to], (err, result) => {
            connection.release();
            if (err) {
              return res.json({
                success: false,
                message: 'Something wen\'t wrong in saving question range. Please try again later.'
              });
            }

            return res.json({
              success: true,
              message: 'Question range has been added.',
              question_range_id: result.insertId
            });
          });
        }
      });
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to create a question range.'
    });
  }
});

// List of Question range
router.get('/lists', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    db.getConnection((err, connection) => {
      if (err) {
          connection.release();
          return res.json({
          success: false,
          message: 'Can\' connect to DB right now. Please try again later.'
          });
      }

      const params = req.query.sort;
      let sql = 'SELECT question_range_id, qr.account_id, question_range_slog, question_range_from, question_range_to, question_range_date, a.account_name, a.account_username FROM tbl_question_range AS qr INNER JOIN tbl_account AS a ON qr.account_id = a.account_id WHERE question_range_slog != ? ORDER BY';
      switch(params) {
        case '0':
          sql += ' question_range_slog ASC, ';
        break;
        case '1':
          sql += ' question_range_slog DESC, ';
        default:
          sql += ' question_range_slog ASC, ';
      }
      sql += 'question_range_date DESC'
      connection.query(sql, ['0'], (err, result) => {
        connection.release();
        if (err) {
          return res.json({
            success: false,
            message: 'Something wen\'t wrong in fetching question range. Please try again later.'
          });
        }
  
        if (!result.length) {
          return res.json({
            success: false,
            message: 'No question range found on DB. Please add a question range.'
          });
        } else {
          return res.json({
            success: true,
            question_ranges: result
          });
        }
      });
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to view the question range.'
    });
  }
});

// Question range details
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
    let sql = 'SELECT qr.account_id, question_range_slog, question_range_from, question_range_to, question_range_date, a.account_name, a.account_username FROM tbl_question_range AS qr INNER JOIN tbl_account AS a ON qr.account_id = a.account_id WHERE question_range_id = ? LIMIT 1';
    connection.query(sql, [id], (err, result) => {
      connection.release();
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong in fetching question range details. Please try again later.'
        });
      }
  
      if (!result.length) {
        return res.json({
          success: false,
          message: 'The question range does not exist. Please don\'t edit the URL.'
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

// Update a Question range
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
      let sql = 'SELECT question_range_slog FROM tbl_question_range WHERE question_range_id = ? LIMIT 1';
      connection.query(sql, [id], (err, result) => {
        if (err) {
          connection.release();
          return res.json({
            success: false,
            message: 'Something wen\'t wrong in checking the question range to update. Please try again later.'
          });
        }
  
        if (!result.length) {
          connection.release();
          return res.json({
            success: false,
            message: 'The question range does not exist. Please don\'t edit the URL.'
          });
        } else {
          // Check if the question range exist in DB
          const slog = req.body.question_range_slog;
          let sql = 'SELECT question_range_id FROM tbl_question_range WHERE question_range_slog = ? LIMIT 1';
          connection.query(sql, [slog], (err, result) => {
            if (err) {
              connection.release();
              return res.json({
                success: false,
                message: 'Something wen\'t wrong in checking for duplicate. Please try again later.'
              });
            }
  
            if ((result[0] && result[0].question_range_id == id) || !result.length) {
              const from = req.body.question_range_from;
              const to = req.body.question_range_to;
              let sql = 'UPDATE tbl_question_range SET question_range_slog = ?, question_range_from = ?, question_range_to = ? WHERE question_range_id = ?';
              connection.query(sql, [slog, from, to, id], (err, result) => {
                connection.release();
                if (err) {
                  return res.json({
                    success: false,
                    message: 'Something wen\'t wrong in updating the question range. Please try again later.'
                  });
                }
  
                return res.json({
                  success: true,
                  message: 'Question range has been updated.'
                });
              });
            } else {
              connection.release();
              return res.json({
                success: false,
                message: 'Question range already exists. Please check the list of question range.'
              });
            }
          });
        }
      });
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to update a question range.'
    });
  }
});

// Delete a question range
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
      let sql = 'SELECT question_range_slog FROM tbl_question_range WHERE question_range_id = ? LIMIT 1';
      connection.query(sql, [id], (err, result) => {
        if (err) {
          connection.release();
          return res.json({
            success: false,
            message: 'Something wen\'t wrong in finding the question range to delete. Please try again later.'
          });
        }
  
        if (!result.length) {
          connection.release();
          return res.json({
            success: false,
            message: 'The question range does not exist. Please don\'t edit the URL.'
          });
        } else {
          let sql = 'DELETE FROM tbl_question_range WHERE question_range_id = ?';
          connection.query(sql, [id], (err, result) => {
            connection.release();
            if (err) {
              return res.json({
                success: false,
                message: 'There are still questions attached to this question range. Please delete the questions attached to this question range before deleting this.'
              });
            }
  
            return res.json({
              success: true,
              message: 'Question range has been deleted.'
            });
          });
        }
      });
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to delete a question range.'
    });
  }
});

module.exports = router;