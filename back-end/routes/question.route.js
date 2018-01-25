const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../config/connection');

// Add a Question
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    const adminId = req.user.account_id;
    // Insert to tbl_question
    const lesson_id = req.body.lesson_id;
    const qr_id = req.body.question_range_id;
    const qt_id = req.body.question_type_id;
    const difficulty_id = req.body.difficulty_id;
    const q_content = req.body.question_content;
    let sql = 'INSERT INTO tbl_question SET lesson_id = ?, question_range_id = ?, question_type_id = ?, account_id = ?, difficulty_id = ?, question_content = ?';
    db.query(sql, [lesson_id, qr_id, qt_id, adminId, difficulty_id, q_content], (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong in inserting the question. Please try again later.'
        });
      }

      // Insert to tbl_answer
      const q_id = result.insertId;
      const a_choices = req.body.answer_choices;
      const a_key = req.body.answer_key;
      let sql = 'INSERT INTO tbl_answer SET question_id = ?, answer_choices = ?, answer_key = ?';
      db.query(sql, [q_id, a_choices, a_key], (err, result) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Something wen\'t wrong in inserting the anwers. Please try again later.'
          });
        }

        return res.json({
          success: true,
          message: 'Question has been added.',
          question_id: q_id
        });
      });
    })
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to create a question.'
    });
  }
});

router.get('/lists/:id', (req, res) => {
  const id = req.params.id;
  const difficulty = req.query.difficulty;
  let sql = `SELECT 
            q.question_id, 
            q.question_range_id, 
            q.question_type_id, 
            q.account_id, 
            q.difficulty_id, 
            q.question_content, 
            q.question_status, 
            q.question_date, 
            qa.answer_id, 
            qa.answer_choices, 
            qa.answer_key, 
            d.difficulty_text, 
            qr.question_range_slog 
            FROM tbl_question AS q 
            INNER JOIN tbl_answer AS qa 
            ON q.question_id = qa.question_id 
            INNER JOIN tbl_difficulty AS d 
            ON q.difficulty_id = d.difficulty_id 
            INNER JOIN tbl_question_range AS qr 
            ON q.question_range_id = qr.question_range_id 
            WHERE q.lesson_id = ? 
            AND q.difficulty_id = ? 
            AND q.question_status = ?`;

  switch(difficulty) {
    case '1':

    break;
    case '2':

    break;
    case '3':

    break;
    default:

  }

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Something wen\'t wrong fetching questions for this lesson. Please try again later.'
      });
    }

    if (!result.length) {
      return res.json({
        success: true,
        message: 'There are no questions for this lesson. Please try again later.'
      });
    } else {
      return res.json({
        type,
        success: true,
        questions: result,
      });
    }
  })
});

module.exports = router;