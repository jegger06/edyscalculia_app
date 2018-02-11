const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../config/connection');

// Adding a lesson
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
      // Check if chapter_id exists on DB
      const chapter_id = req.body.chapter_id;
      let sql = 'SELECT chapter_id FROM tbl_chapter WHERE chapter_id = ? LIMIT 1';
      connection.query(sql, chapter_id, (err, result) => {
        if (err) {
          connection.release();
          return res.json({
            success: false,
            message: 'Something wen\'t wrong. Please try again later.'
          });
        }

        if (!result[0]) {
          connection.release();
          return res.json({
            success: false,
            message: 'Chapter not found on DB. Please select an existing chapter.'
          });
        } else {
          // Check if lesson already exists in DB
          const lesson_slog = req.body.lesson_slog;
          let sql = 'SELECT lesson_id FROM tbl_lesson WHERE lesson_slog = ? LIMIT 1' ;
          connection.query(sql, [lesson_slog], (err, result) => {
            if (err) {
              connection.release();
              return res.json({
                success: false,
                message: 'Unable to check the lesson title now. Please try again later.'
              });
            }

            if (result[0]) {
              connection.release();
              return res.json({
                success: false,
                message: 'Lesson already exists on DB. Please change your lesson.'
              });
            } else {
              // Insert lesson to DB
              const account_id = req.user.account_id;
              const lesson_title = req.body.lesson_title;
              const lesson_content = req.body.lesson_content;
              const date_created = new Date();
              let sql = 'INSERT INTO tbl_lesson SET account_id = ?, chapter_id = ?, lesson_title = ?, lesson_slog = ?, lesson_content = ?, lesson_date = ?';
              connection.query(sql, [account_id, chapter_id, lesson_title, lesson_slog, lesson_content, date_created], (err, result) => {
                connection.release();
                if (err) {
                  return res.json({
                    success: false,
                    message: 'Unable to add a lesson now. Please try again later.'
                  });
                }

                return res.json({
                  success: true,
                  message: 'Lesson has been added.',
                  lesson_id: result.insertId
                });
              });
            }
          });
        }
      });
    });
  } else {
    res.json({
      success: false,
      message: 'You don\'t have the rights to create a lesson.'
    })
  }
  
});

// Lists of all lessons
router.get('/lists', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
        connection.release();
        return res.json({
        success: false,
        message: 'Can\' connect to DB right now. Please try again later.'
        });
    }

    let params = req.query.sort;
    let sql = 'SELECT l.lesson_id, l.account_id, l.chapter_id, l.lesson_title, l.lesson_slog, l.lesson_content, l.lesson_status, l.lesson_date, c.chapter_id, c.chapter_text, c.chapter_status, a.account_id, a.account_name, a.account_username FROM tbl_lesson AS l INNER JOIN tbl_chapter AS c ON l.chapter_id = c.chapter_id INNER JOIN tbl_account AS a ON l.account_id = a.account_id ORDER BY ';
    switch(params) {
      case '1':
        sql += 'l.lesson_status DESC,  ';
      break;
      case '0':
        sql += 'l.lesson_status ASC, ';
      break;
      default:
        sql += '';
    }
    sql += 'lesson_date DESC';
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong fetching lessons in DB. Please try again later.'
        });
      }

      return res.json({
        success: true,
        lessons: result
      });
    });
  });
});

// List of Lessons
router.get('/lists/:chapter_id', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
        connection.release();
        return res.json({
        success: false,
        message: 'Can\' connect to DB right now. Please try again later.'
        });
    }

    const chapter_id = req.params.chapter_id;
    let sql = 'SELECT chapter_text FROM tbl_chapter WHERE chapter_id = ? LIMIT 1';
    connection.query(sql, [chapter_id], (err, result) => {
      if (err) {
        connection.release();
        return res.json({
          success: false,
          message: 'Something wen\'t wrong. Please try again later.'
        });
      }
      if (!result.length) {
        connection.release();
        return res.json({
          success: false,
          message: 'The chapter does not exist. Please do not edit the URL.'
        });
      } else {
        let params = req.query.sort;
        let sql = 'SELECT l.lesson_id, l.account_id, l.chapter_id, l.lesson_title, l.lesson_slog, l.lesson_content, l.lesson_status, l.lesson_date, c.chapter_id, c.chapter_text, c.chapter_status, a.account_id, a.account_name, a.account_username FROM tbl_lesson AS l INNER JOIN tbl_chapter AS c ON l.chapter_id = c.chapter_id INNER JOIN tbl_account AS a ON l.account_id = a.account_id WHERE l.chapter_id = ? ';
        switch(params) {
          case '1':
            sql += 'AND l.lesson_status = ?  ';
          break;
          case '0':
            sql += 'AND l.lesson_status = ? ';
          break;
          default:
            sql += '';
            params = '';
        }
        sql += 'ORDER BY l.lesson_status DESC, lesson_date DESC';
        connection.query(sql, [chapter_id, params], (err, result) => {
          connection.release();
          if (err) {
            return res.json({
              success: false,
              message: 'Something wen\'t wrong. Please try again later.'
            });
          }
  
          if (!result.length) {
            let message = (params == 1) ? 'No active lessons for this chapter.' : ((params == '') ? 'No lessons added for this chapter.' : 'No inactive lessons for this chapter.');  
            return res.json({
              success: false,
              message: message
            });
          }
  
          res.json({
            success: true,
            lessons: result
          });
  
        });
      }
    });
  });
});

// Lesson Details
router.get('/:id', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
        connection.release();
        return res.json({
        success: false,
        message: 'Can\' connect to DB right now. Please try again later.'
        });
    }

    const lesson_id = req.params.id;
    let sql = 'SELECT l.lesson_id, l.account_id, l.chapter_id, l.lesson_title, l.lesson_slog, l.lesson_content, l.lesson_status, l.lesson_date, c.chapter_id, c.chapter_text, c.chapter_status, a.account_id, a.account_name, a.account_username FROM tbl_lesson AS l INNER JOIN tbl_chapter AS c ON l.chapter_id = c.chapter_id INNER JOIN tbl_account AS a ON l.account_id = a.account_id WHERE l.lesson_id = ? LIMIT 1';
    connection.query(sql, [lesson_id], (err, result) => {
      connection.release();
      if (err) {
        return res.json({
          success: false,
          message: 'Something wen\'t wrong on fetching lesson details. Please try again later.'
        });
      }
  
      if (!result.length) {
        return res.json({
          success: false,
          message: 'No details fetched for this lesson. Please don\'t edit the URL.'
        });
      }
  
      return res.json({
        success: true,
        details: result[0]
      });
    });
  });
});

// Update a lesson
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
      let sql = 'SELECT lesson_title FROM tbl_lesson WHERE lesson_id = ? LIMIT 1';
      connection.query(sql, [id], (err, result) => {
        if (err) {
          connection.release();
          return res.json({
            success: false,
            message: 'Something wen\'t wrong finding lesson to update. Please try again later.'
          });
        }
  
        if (!result.length) {
          connection.release();
          return res.json({
            success: false,
            message: 'The lesson does not exist. Please don\'t edit the URL.'
          });
        } else {
          // Check if the lesson exists in DB
          const lesson_slog = req.body.lesson_slog;
          let sql = 'SELECT lesson_id FROM tbl_lesson WHERE lesson_slog = ? LIMIT 1';
          connection.query(sql, [lesson_slog], (err, result) => {
            if (err) {
              connection.release();
              return res.json({
                success: false,
                message: 'Something wen\'t wrong in checking for duplicate. Please try again later.'
              });
            }
  
            if ((result[0] && result[0].lesson_id == id) || !result.length) {
              const lesson_title = req.body.lesson_title;
              const lesson_content = req.body.lesson_content;
              const status = req.body.lesson_status;
              let sql = 'UPDATE tbl_lesson SET lesson_title = ?, lesson_slog = ?, lesson_content = ?, lesson_status = ? WHERE lesson_id = ?';
              connection.query(sql, [lesson_title, lesson_slog, lesson_content, status, id], (err, result) => {
                connection.release();
                if (err) {
                  return res.json({
                    success: false,
                    message: 'Unable to update lesson. Please try again later.'
                  });
                }
  
                return res.json({
                  success: true,
                  message: 'Lesson has been updated.'
                });
              });
            } else {
              connection.release();
              return res.json({
                success: false,
                message: 'Lesson title already exists. Please check the list of lessons.'
              });
            }
          });
        }
      });
    });
  } else {
    return res.json({
      success: false,
      message: 'You don\'t have the rights to update a lesson.'
    })
  }
});

// Delete a lesson
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
      let sql = 'SELECT lesson_title FROM tbl_lesson WHERE lesson_id = ? LIMIT 1';
      connection.query(sql, [id], (err, result) => {
        if (err) {
          connection.release();
          return res.json({
            success: false,
            message: 'Something wen\'t wrong. Please try again later.'
          });
        }
  
        if (!result.length) {
          connection.release();
          return res.json({
            success: false,
            message: 'The lesson does not exist. Please don\'t edit the URL.'
          });
        } else {
          let sql = 'DELETE FROM tbl_lesson WHERE lesson_id = ?';
          connection.query(sql, [id], (err, result) => {
            connection.release();
            if (err) {
              return res.json({
                success: false,
                message: 'Deleting lesson failed. Please try again later.'
              });
            }
            return res.json({
              success: true,
              message: 'Lesson has been deleted.'
            })
          });
        }
      });
    });
  } else {
    return res.json({
      success: false,
      message: 'You don\'t have the rights to delete a lesson.'
    });
  }
});

module.exports = router;