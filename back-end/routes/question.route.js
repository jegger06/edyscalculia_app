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

router.get('/lists/:lesson_id', (req, res) => {
  const id = req.params.lesson_id;
  let difficulty = req.query.difficulty;
  let range = req.query.range;
  let status = req.query.status;
  let sql = `SELECT q.question_id, q.question_range_id, q.question_type_id, q.account_id, q.difficulty_id, q.question_content, q.question_status, q.question_date, a.account_name, qa.answer_id, qa.answer_choices, qa.answer_key FROM tbl_question AS q INNER JOIN tbl_account AS a ON q.account_id = a.account_id INNER JOIN tbl_answer AS qa ON q.question_id = qa.question_id WHERE q.lesson_id = ? AND `;

  if (difficulty) {
    sql += 'q.difficulty_id = ? AND '
  } else {
    sql += 'q.difficulty_id = ? AND ';
    difficulty = 1;
  }

  // Check if difficulty is not a pre-test which has an Id of 1 in our DB
  if ((difficulty != 1) && range) {
    sql += 'q.question_range_id = ? ';
  } else {
    sql += 'q.question_range_id = ? ';
    range = 0;
  }
  
  const data = [id, difficulty, range];
  if (status) {
    data.push(status);
    sql += 'AND q.question_status = ? ';
  } else {
    sql += 'ORDER By q.question_status DESC';
  }

  db.query(sql, data, (err, result) => {
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
        success: true,
        questions: result
      });
    }
  })
});

router.get('/exam', passport.authenticate(['jwt', 'anonymous'], { session: false }), (req, res) => {
  const lessonId = req.query.lesson_id;
  const difficultyId = req.query.difficulty;
  const status = 1;
  let questionQuery = `SELECT
              q.question_id,
              q.lesson_id,
              q.question_range_id,
              q.question_type_id,
              q.difficulty_id,
              q.question_content,
              q.question_status,
              qa.answer_id,
              qa.answer_choices,
              qa.answer_key
            FROM
              tbl_question AS q
            INNER JOIN tbl_answer AS qa
            ON
              q.question_id = qa.question_id
            WHERE q.lesson_id = ? AND q.question_status = ? AND q.difficulty_id = ? `;
  const queryData = [lessonId, status, difficultyId];
  if (difficultyId != 1 && req.user) {
      const accountId = req.user.account_id;
      const preTest = 1; // pre-test in DB
      let sql = `SELECT
                  question_range_id,
                  question_range_slog
                FROM
                  tbl_question_range
                WHERE 
                (SELECT score_count FROM tbl_score WHERE account_id = ? AND lesson_id = ? AND difficulty_id = ? ORDER BY score_count DESC LIMIT 1)
                BETWEEN question_range_from AND question_range_to`;
      db.query(sql, [accountId, lessonId, preTest], (err, result) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Something wen\'t wrong in getting the range of exam to take. Please try again later.'
          });
        }
  
        if (result.length) {
          // query of questions 
          // conditions
          questionQuery += ' AND q.question_range_id = ?';
          queryData.push(result[0].question_range_id);

        } 
        // else {
        //   // No pre-test found for this user on the lesson_id provided
        //   // query pre-test based on lesson id passed.
        //   return res.json({
        //     success: true,
        //     questions: []
        //   });
        // }
        })
    }
    //  else {
    //   // get 5 questions of pre-test based on lessons
    //   // conditions
    //   // where lesson_id = lessonId AND difficultyId = 1 AND question_status = 1 LIMIT 5;
    // }
    setTimeout(() => {
      questionQuery += ' LIMIT 5';
      db.query(questionQuery, queryData, (err, result) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Something wen\'t wrong fetching the questions. Please try again later.'
          });
        }
  
        return res.json({
          success: true,
          numberOfQuestions: result.length,
          questions: result
        });
      });
    }, 200)
  
    // query 5 question base on difficulty, range and lesson
    // query
    // db.query(sql)

  
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  let sql = 'SELECT q.question_range_id, q.question_type_id, q.account_id, q.difficulty_id, q.question_content, q.question_status, q.question_date, a.account_name, qa.answer_id, qa.answer_choices, qa.answer_key FROM tbl_question AS q INNER JOIN tbl_account AS a ON q.account_id = a.account_id INNER JOIN tbl_answer AS qa ON q.question_id = qa.question_id WHERE q.question_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Something wen\'t wrong fetching question details. Please try again later.'
      });
    }

    if (!result.length) {
      return res.json({
        success: false,
        message: 'The question does not exist. Please don\'t edit the URL.'
      });
    }

    return res.json({
      success: true,
      details: result[0]
    });
  })
});

router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    const id = req.params.id;
    let sql = 'SELECT lesson_id FROM tbl_question WHERE question_id = ? LIMIT 1';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong in checking the question to update. Please try again later.'
        });
      }

      if (!result.length) {
        return res.json({
          success: false,
          message: 'The question does not exist. Please don\'t edit the URL.'
        });
      } else {
        const range_id = req.body.question_range_id;
        const type_id = req.body.question_type_id;
        const difficulty_id = req.body.difficulty_id;
        const content = req.body.question_content;
        const status = req.body.question_status;
        const choices = req.body.answer_choices;
        const key = req.body.answer_key;
        let sql = 'UPDATE tbl_question SET question_range_id = ?, question_type_id = ?, difficulty_id = ?, question_content = ?, question_status = ? WHERE question_id = ?';
        db.query(sql, [range_id, type_id, difficulty_id, content, status, id], (err, result) => {
          if (err) {
            return res.json({
              success: false,
              message: 'Something wen\'t wrong in updating the question in DB. Please try again later.'
            });
          }

          let sql = 'UPDATE tbl_answer SET answer_choices = ?, answer_key = ? WHERE question_id = ?';
          db.query(sql, [choices, key, id], (err, result) => {
            if (err) {
              return res.json({
                success: false,
                message: 'Something wen\'t wrong in updating the question answers in DB. Please try again later.'
              });
            }

            return res.json({
              success: true,
              message: 'Question has been updated.'
            });
          })
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to update a question.'
    });
  }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    const id = req.params.id;
    let sql = 'SELECT lesson_id FROM tbl_question WHERE question_id = ? LIMIT 1';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong in checking the question to update. Please try again later.'
        });
      }

      if (!result.length) {
        return res.json({
          success: false,
          message: 'The question does not exist. Please don\'t edit the URL.'
        });
      } else {
        let sql = 'DELETE FROM tbl_question WHERE question_id = ?';
        db.query(sql, [id], (err, result) => {
          if (err) {
            return res.json({
              success: false,
              message: 'Something wen\'t wrong in deleting the question. Please try again later.'
            });
          }

          return res.json({
            success: true,
            message: 'Question has been deleted.'
          });
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to delete a question.'
    });
  }
});



module.exports = router;