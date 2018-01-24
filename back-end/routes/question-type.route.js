const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../config/connection');

// Create a question type
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    // Check if question type exist in DB
    const slog = req.body.question_type_slog;
    let sql = 'SELECT question_type_id FROM tbl_question_type WHERE question_type_slog = ? LIMIT 1';
    db.query(sql, [slog], (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong in checking for duplicate. Please try again later.'
        });
      }

      if (result.length) {
        return res.json({
          success: false,
          message: 'Question type already exists. Please try again.'
        });
      } else {
        const adminId = req.user.account_id;
        const text = req.body.question_type_text;
        let sql = 'INSERT INTO tbl_question_type SET account_id = ?, question_type_slog = ?, question_type_text = ?';
        db.query(sql, [adminId, slog, text], (err, result) => {
          if (err) {
            return res.json({
              success: false,
              message: 'Something wen\'t wrong in saving question type. Please try again later.'
            });
          }

          return res.json({
            success: true,
            message: 'Question type has been added.',
            question_type_id: result.insertId
          });
        });
      }
    })
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to create a question type.'
    });
  }
});

// Lists of question type
router.get('/lists', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    const params = req.query.sort;
    let sql = 'SELECT question_type_id, qt.account_id, question_type_slog, question_type_text, question_type_date, a.account_name, a.account_username FROM tbl_question_type AS qt INNER JOIN tbl_account AS a ON qt.account_id = a.account_id ORDER BY';
    switch(params) {
      case '0':
        sql += ' question_type_text ASC, ';
      break;
      case '1':
        sql += ' question_type_text DESC, ';
      default:
        sql += ' question_type_text ASC, ';
    }
    sql += 'question_type_date DESC'
    db.query(sql, (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong in fetching question type. Please try again later.'
        });
      }

      if (!result.length) {
        return res.json({
          success: false,
          message: 'No question type found on DB. Please add a question type.'
        });
      } else {
        return res.json({
          success: true,
          question_types: result
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to view the question type.'
    });
  }
});

// Question type details
router.get('/:id', (req, res) => {
  const id = req.params.id;
  let sql = 'SELECT qt.account_id, question_type_slog, question_type_text, question_type_date, a.account_name, a.account_username FROM tbl_question_type AS qt INNER JOIN tbl_account AS a ON qt.account_id = a.account_id WHERE question_type_id = ? LIMIT 1';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Something wen\'t wrong in fetching question type details. Please try again later.'
      });
    }

    if (!result.length) {
      return res.json({
        success: false,
        message: 'The question type does not exist. Please don\'t edit the URL.'
      });
    } else {
      return res.json({
        success: true,
        details: result[0]
      });
    }
  });
});

// Update a Question Type
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    const id = req.params.id;
    let sql = 'SELECT question_type_text FROM tbl_question_type WHERE question_type_id = ? LIMIT 1';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong in checking the question type to update. Please try again later.'
        });
      }

      if (!result.length) {
        return res.json({
          success: false,
          message: 'The question type does not exist. Please don\'t edit the URL.'
        });
      } else {
        // Check if the question type slog exist in DB
        const slog = req.body.question_type_slog;
        let sql = 'SELECT question_type_id FROM tbl_question_type WHERE question_type_slog = ? LIMIT 1';
        db.query(sql, [slog], (err, result) => {
          if (err) {
            return res.json({
              success: false,
              message: 'Something wen\'t wrong in checking for duplicate. Please try again later.'
            });
          }

          if ((result[0] && result[0].question_type_id == id) || !result.length) {
            const text = req.body.question_type_text;
            let sql = 'UPDATE tbl_question_type SET question_type_slog = ?, question_type_text = ? WHERE question_type_id = ?';
            db.query(sql, [slog, text, id], (err, result) => {
              if (err) {
                return res.json({
                  success: false,
                  message: 'Something wen\'t wrong in updating the question type. Please try again later.'
                });
              }

              return res.json({
                success: true,
                message: 'Question type has been updated.'
              });
            })
          } else {
            return res.json({
              success: false,
              message: 'Question type already exists. Please check the list of question type.'
            });
          }
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to update a question type.'
    });
  }
});

// Delete a Question Type
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    const id = req.params.id;
    let sql = 'SELECT question_type_text FROM tbl_question_type WHERE question_type_id = ? LIMIT 1';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong in finding the question type to delete. Please try again later.'
        });
      }

      if (!result.length) {
        return res.json({
          success: false,
          message: 'The question type does not exist. Please don\'t edit the URL.'
        });
      } else {
        let sql = 'DELETE FROM tbl_question_type WHERE question_type_id = ?';
        db.query(sql, [id], (err, result) => {
          if (err) {
            return res.json({
              success: false,
              message: 'There are still questions attached to this question type. Please delete the questions attached to this question type before deleting this.'
            });
          }

          return res.json({
            success: true,
            message: 'Question type has been deleted.'
          });
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to delete a question type.'
    });
  }
});

module.exports = router;