const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../config/connection');

// Get top 3 score per difficulty
router.get('/top', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    db.getConnection((err, connection) => {
      if (err) {
          connection.release();
          return res.json({
          success: false,
          message: 'Can\' connect to DB right now. Please try again later.'
          });
      }

      let id = req.query.difficulty;
      let sql = 'SELECT s.score_id, s.lesson_id, s.difficulty_id, s.account_id, s.score_count, s.score_date, d.difficulty_text, a.account_name, l.lesson_title FROM tbl_score AS s INNER JOIN tbl_difficulty AS d ON s.difficulty_id = d.difficulty_id INNER JOIN tbl_account AS a ON s.account_id = a.account_id INNER JOIN tbl_lesson AS l ON s.lesson_id = l.lesson_id WHERE s.difficulty_id = ? ORDER BY s.score_count DESC LIMIT 3';
      if (!id) {
        id = 1; // pre-test
      }
      connection.query(sql, [id], (err, result) => {
        connection.release();
        if (err) {
          return res.json({
            success: false,
            message: 'Something wen\'t wrong in getting the top score. Please try again later.'
          });
        }
  
        if (!result.length) {
          return res.json({
            success: false,
            message: 'No records yet in DB. Please try again later.'
          });
        }
  
        return res.json({
          success: true,
          topscore: result
        });
      });
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to view the top score.'
    });
  }
});

// Check user taken the pre-test for lesson
router.get('/pre-test/:lesson_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
        connection.release();
        return res.json({
        success: false,
        message: 'Can\' connect to DB right now. Please try again later.'
        });
    }

    const lessonId = req.params.lesson_id;
    const accountId = req.user.account_id;
    const difficultyId = 1;
    let sql = 'SELECT score_id, lesson_id, difficulty_id, account_id, score_count, score_date FROM tbl_score WHERE account_id = ? AND lesson_id = ? AND difficulty_id = ? ORDER BY score_count DESC, score_date DESC LIMIT 1';
    connection.query(sql, [accountId, lessonId, difficultyId], (err, result) => {
      connection.release();
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong in fetching the score details for this lesson. Please try again later.'
        });
      }
  
      if (!result.length) {
        return res.json({
          success: false,
          message: 'You haven\'t taken the pre-test for this lesson yet. Take the pre-test to get the score details for this lesson.'
        })
      }
  
      return res.json({
        success: true,
        detail: result[0]
      });
    });
  
  });
  
});

// Save the score
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
        connection.release();
        return res.json({
        success: false,
        message: 'Can\' connect to DB right now. Please try again later.'
        });
    }

    const lessonId = req.body.lesson_id;
    const difficultyId = req.body.difficulty_id;
    const score = req.body.score;
    const accountId = req.user.account_id;
    let sql = 'INSERT INTO tbl_score SET lesson_id = ?, difficulty_id = ?, account_id = ?, score_count = ?';
    connection.query(sql, [lessonId, difficultyId, accountId, score], (err, result) => {
      connection.release();
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong in saving the score. Please try again later.'
        });
      }
  
      return res.json({
        success: true,
        message: 'Score has been saved.',
        scoreId: result.insertId
      });
    });
  });
});

router.get('/lists/:difficulty_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
        connection.release();
        return res.json({
        success: false,
        message: 'Can\' connect to DB right now. Please try again later.'
        });
    }

    const difficultyId = req.params.difficulty_id;
    const accountId = req.user.account_id;
    let sql = 'SELECT s.score_id, s.lesson_id, s.difficulty_id, s.account_id, s.score_count, s.score_date, l.lesson_title, c.chapter_id, c.chapter_text FROM tbl_score AS s INNER JOIN tbl_lesson AS l ON s.lesson_id = l.lesson_id INNER JOIN tbl_chapter AS c ON l.chapter_id = c.chapter_id WHERE s.difficulty_id = ? AND s.account_id = ? ORDER BY score_count DESC, score_date DESC';
    connection.query(sql, [difficultyId, accountId], (err, result) => {
      connection.release();
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong in getting the lists of score. Please try again later.'
        });
      }
  
      if (result.length) {
        return res.json({
          success: true,
          scoreSheet: result
        });
      } else {
        return res.json({
          success: false,
          message: 'No score lists for this difficulty. Please select other difficulty.'
        })
      }
    });
  });
});

module.exports = router;