const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../config/connection');

// Adding of Chapter
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.type_slog === 'admin') {
        // Check if `chapter_slog` exist on DB
        const chapter_slog = req.body.chapter_slog;
        let sql = 'SELECT chapter_text FROM tbl_chapter WHERE chapter_slog = ? LIMIT 1';
        db.query(sql, [chapter_slog], (err, result) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error in checking the slog. Please try again later.'
                });
            }
            if (!result.length) {
                // Save chapter in db
                const account_id = req.user.account_id;
                const chapter_text = req.body.chapter_text;
                const date_created = new Date();
                let sql = 'INSERT INTO tbl_chapter SET account_id = ?, chapter_slog = ?, chapter_text = ?, chapter_date = ?';
                db.query(sql, [account_id, chapter_slog, chapter_text, date_created], (err, result) => {
                    if (err) {
                        return res.json({
                            success: false,
                            message: 'Error in saving chapter in Database. Please try again later.'
                        });
                    }
    
                    return res.json({
                        success: true,
                        message: 'Chapter has been saved.',
                        chapter_id: result.insertId
                    });
                });
            } else {
                return res.json({
                    success: false,
                    message: 'Chapter text already exist. Please check the chapter lists.'
                });
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'You don\'t have the rights to create a chapter.'
        });
    }
});

// List of Chapters
router.get('/lists', (req, res) => {
    let params = req.query.sort;
    let sql = 'SELECT c.chapter_id, c.account_id, c.chapter_slog, c.chapter_text, c.chapter_status, c.chapter_date, a.account_name, a.account_username FROM tbl_chapter AS c INNER JOIN tbl_account AS a ON c.account_id = a.account_id ';
    switch(params) {
        case '1':
            sql += 'WHERE chapter_status = ? ';
        break;
        case '0':
            sql += 'WHERE chapter_status = ? ';
        break;
        default:
            sql += '';
            params = '';
    }
    sql += 'ORDER BY chapter_status DESC, chapter_date DESC';
    db.query(sql, [params], (err, result) => {
        
        if (err) {
            return res.json({
                success: false,
                message: 'Error in getting chapters in DB. Please try again later.'
            });
        }

        if (!result.length) {
            return res.json({
                success: true,
                message: 'No chapters added yet. Try to add a chapter.'
            });
        } else {
            
            return res.json({
                query: req.query.sort,
                success: true,
                chapters: result
            });
        }
    });
});

// Chapter Details
router.get('/:id', (req, res) => {
    const id = req.params.id;
    let sql = 'SELECT chapter_id, account_id, chapter_slog, chapter_text, chapter_status, chapter_date FROM tbl_chapter WHERE chapter_id = ? LIMIT 1';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Error in getting chapter details in DB. Please try again later.'
            });
        }

        if (!result.length) {
            return res.json({
                success: false,
                message: 'The chapter does not exist. Please don\'t edit the URL.'
            });
        } else {
            return res.json({
                success: true,
                details: result[0]
            });
        }
    }); 
});

// Update a chapter
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.type_slog === 'admin') {
        const id = req.params.id;
        let sql = 'SELECT chapter_id, chapter_slog, chapter_text, chapter_date FROM tbl_chapter WHERE chapter_id = ? LIMIT 1';
        db.query(sql, [id], (err, result) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error in getting chapter details in DB. Please try again later.'
                });
            }
    
            if (!result.length) {
                return res.json({
                    success: false,
                    message: 'The chapter does not exist. Please don\'t edit the URL.'
                });
            } else {
                const chapter_slog = req.body.chapter_slog;
                const chapter_text = req.body.chapter_text;
                const chapter_status = req.body.chapter_status;
                const date_updated = new Date();
                let sql = 'UPDATE tbl_chapter SET chapter_slog = ?, chapter_text = ?, chapter_status = ?, chapter_date = ? WHERE chapter_id = ?';
                db.query(sql, [chapter_slog, chapter_text, chapter_status, date_updated, id], (err, result) => {
                    if (err) {
                        return res.json({
                            success: false,
                            message: 'Error in updating chapter in DB. Please try again later.'
                        });
                    }
                    return res.json({
                        success: true,
                        message: 'Chapter has been updated.'
                    });
                });
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'You don\'t have the rights to update a chapter.'
        });
    }
});

// Delete chapter
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.type_slog === 'admin') {
        const id = req.params.id;
        let sql = 'SELECT COUNT(lesson_id) AS total FROM tbl_lesson WHERE chapter_id = ?';
        db.query(sql, id, (err, result) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Something wen\'t wrong. Please try again later.'
                });
            }
    
            if (result[0].total > 0) {
                // Dont delete chapter
                const message = (result[0].total == 1) ? 'There is still a lesson attached to this chapter. Kindly delete it first before deleting this chapter.' : 'There are still some lessons attached to this chapter. Kindly delete them first before deleting this chapter.';
                return res.json({
                    success: false,
                    message: message
                })
            } else {
                // delete chapter
                let sql = 'DELETE FROM tbl_chapter WHERE chapter_id = ?';
                db.query(sql, id, (err, result) => {
                    if (err) {
                        return res.json({
                            success: false,
                            message: 'Error in deleting chapter. Please try again later.'
                        });
                    }
    
                    if (result.affectedRows != 1) {
                        return res.json({
                            success: false,
                            message: 'No chapter found. Please don\'t edit the URL.'
                        });
                    } else {
                        return res.json({
                            success: true,
                            message: 'Chapter has been deleted.'
                        });
                    }
                 });
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'You don\'t have the rights to delete a chapter.'
        });
    }
});

module.exports = router;
