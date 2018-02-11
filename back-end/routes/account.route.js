const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../config/connection');

// Adding of Account Type
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    const slog = req.body.type_slog;
    const description = req.body.type_description;
    db.getConnection((err, connection) => {
      if (err) {
        connection.release();
        return res.json({
          success: false,
          message: 'Can\' connect to DB right now. Please try again later.'
        });
      }

      let sql = 'SELECT type_id FROM tbl_type WHERE type_slog = ? LIMIT 1';
      connection.query(sql, [slog], (err, result) => {
        if (err) {     
          connection.release();   
          return res.json({
            success: false,
            message: 'Something wen\'t wrong checking for duplicate. Please try again later.'
          });
        }

        if (result.length) {
          connection.release();
          return res.json({
            success: false,
            message: 'Account Type already exist. Please see the list of account type.'
          });
        } else {
          let sql = 'INSERT INTO tbl_type SET type_slog = ?, type_description = ?, type_status = ?';
          connection.query(sql, [slog, description, 0], (err, result) => {
            connection.release();
            if (err) {
              return res.json({
                success: false,
                message: 'Something wen\'t wrong inserting account type. Please try again later.'
              });
            }

            return res.json({
              success: true,
              message: 'Account Type added.',
              type_id: result.insertId
            });
          });
        }
      }); // End of Query
    });
  } else {
    return res.json({
      success: false,
      message: 'You don\'t have the rights to create an account type.'
    });
  }
})

// Lists of Account Type
router.get('/lists', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    let params = req.query.sort;
    db.getConnection((err, connection) => {
      if (err) {
        connection.release();
        return res.json({
          success: false,
          message: 'Can\' connect to DB right now. Please try again later.'
        });
      }

      let sql = 'SELECT type_id, type_slog, type_description, type_status, type_date FROM tbl_type ';
      switch(params) {
        case '0':
          sql += 'WHERE type_status = ? ';
        break;
        case '1':
          sql += 'WHERE type_status = ? ';
        break;
        default:
          sql += '';
          params = '';
      }
      sql += 'ORDER BY type_status DESC, type_date DESC';
      connection.query(sql, [params], (err, result) => {
        connection.release();
        if (err) {
          return res.json({
            success: false,
            message: 'Something wen\'t wrong on fetching Account Type. Please try again later.'
          });
        }
        
        if (!result.length) {
          return res.json({
            success: false,
            message: 'No Account Type yet. Please add an Account Type.'
          });
        } else {
          return res.json({
            success: true,
            account_types: result
          });
        }
      });
    });
  } else {
    return res.json({
      success: false,
      message: 'You don\'t have the rights to view the list of account type.'
    });
  }
});

// Account Type Details
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    const id = req.params.id;
    db.getConnection((err, connection) => {
      if (err) {
        connection.release();
        return res.json({
          success: false,
          message: 'Can\' connect to DB right now. Please try again later.'
        });
      }
      let sql = 'SELECT type_slog, type_description, type_status, type_date FROM tbl_type WHERE type_id = ? LIMIT 1';
      connection.query(sql, [id], (err, result) => {
        connection.release();
        if (err) {
          return res.json({
            success: false,
            message: 'Something wen\'t wrong checking for the Account Type. Please try again later.'
          });
        }

        if (!result.length) {
          return res.json({
            success: false,
            message: 'The Account Type does not exist. Please don\'t edit the URL.'
          });
        } else  {
          return res.json({
            success: true,
            type_details: result[0]
          });
        }
      });
    });
  } else {
    return res.json({
      success: false,
      message: 'You don\'t have the rights to view the details of Account Type.'
    })
  }
});

router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    const id = req.params.id;
    db.getConnection((err, connection) => {
      if (err) {
        connection.release();
        return res.json({
          success: false,
          message: 'Can\' connect to DB right now. Please try again later.'
        });
      }
      let sql = 'SELECT type_slog FROM tbl_type WHERE type_id = ? LIMIT 1';
      connection.query(sql, [id], (err, result) => {
        if (err) {
          connection.release();
          return res.json({
            success: false,
            message: 'Something wen\'t wrong in finding the account type to update. Please try again later.'
          });
        }

        if (!result.length) {
          connection.release();
          return res.json({
            success: false,
            message: 'The Account Type does not exist. Please don\'t edit the URL.'
          });
        } else {
          const slog = req.body.type_slog;
          let sql = 'SELECT type_id FROM tbl_type WHERE type_slog = ? LIMIT 1';
          connection.query(sql, [slog], (err, result) => {
            if (err) {
              connection.release();
              return res.json({
                success: false,
                message: 'Something wen\'t wrong in checking for duplicate. Please try again later.'
              });
            }

            if ((result[0] && result[0].type_id == id) || !result.length) {
              const description = req.body.type_description;
              const status = req.body.type_status;
              let sql = 'UPDATE tbl_type SET type_slog = ?, type_description = ?, type_status = ? WHERE type_id = ?';
              connection.query(sql, [slog, description, status, id], (err, result) => {
                connection.release();
                if (err) {
                  return res.json({
                    success: false,
                    message: 'Something wen\'t wrong in updating the Account Type. Please try again later.'
                  });
                }

                return res.json({
                  success: true,
                  message: 'Account Type has been updated.'
                })
              });
            } else {
              connection.release();
              return res.json({
                success: false,
                message: 'Account Type already exists. Please check the list of Account Type.'
              });
            }
          });
        }
      });
    });
  } else {
    return res.json({
      success: false,
      message: 'You don\'t have the rights to edit an Account Type.'
    })
  }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.type_slog === 'admin') {
    const id = req.params.id;
    db.getConnection((err, connection) => {
      if (err) {
        connection.release();
        return res.json({
          success: false,
          message: 'Can\' connect to DB right now. Please try again later.'
        });
      }
      let sql = 'SELECT type_slog FROM tbl_type WHERE type_id = ? LIMIT 1';
      connection.query(sql, [id], (err, result) => {
        if (err) {
          connection.release();
          return res.json({
            success: false,
            message: 'Something wen\'t wrong in finding the account type to delete. Please try again later.'
          });
        }

        if (!result.length) {
          connection.release();
          return res.json({
            success: false,
            message: 'The Account Type does not exist. Please don\'t edit the URL.'
          });
        } else {
          let sql = 'DELETE FROM tbl_type WHERE type_id = ?';
          connection.query(sql, [id], (err, result) => {
            connection.release();
            if (err) {
              return res.json({
                success: false,
                message: 'There are still Accounts with this Account Type. Please delete them first before deleting this Account Type.'
              });
            }

            return res.json({
              success: true,
              message: 'Account Type has been deleted.'
            });
          });
        }
      });
    });
  } else {
    return res.json({
      success: false,
      message: 'You don\'t have the rights to delete an Account Type.'
    });
  }
})

module.exports = router;