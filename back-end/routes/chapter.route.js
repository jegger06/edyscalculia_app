const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../config/connection');

// Adding of Chapter
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
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
            const chapter_text = req.body.chapter_text;
            const date_created = new Date();
            let sql = 'INSERT INTO tbl_chapter SET chapter_slog = ?, chapter_text = ?, chapter_date = ?';
            db.query(sql, [chapter_slog, chapter_text, date_created], (err, result) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Error in saving chapter in Database. Please try again later.'
                    });
                }

                return res.json({
                    success: true,
                    message: 'Chapter has been saved.'
                });
            });
        } else {
            return res.json({
                success: false,
                message: 'Chapter text already exist. Please check the chapter lists.'
            });
        }
    });
});

// List of Chapters
router.get('/lists', (req, res) => {
    let sql = 'SELECT chapter_id, chapter_slog, chapter_text, chapter_date FROM tbl_chapter WHERE chapter_id = 3 ORDER BY chapter_date ASC';
    db.query(sql, (err, result) => {
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
                success: true,
                chapters: result
            });
        }
    });
});

// Chapter Details
router.get('/:id', (req, res) => {
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
            return res.json({
                success: true,
                details: result[0]
            });
        }
    }); 
});

// Update a chapter
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
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
            const date_updated = new Date();
            let sql = 'UPDATE tbl_chapter SET chapter_slog = ?, chapter_text = ?, chapter_date = ? WHERE chapter_id = ?';
            db.query(sql, [chapter_slog, chapter_text, date_updated, id], (err, result) => {
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
});

// Delete chapter
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.params.id;
    let sql = 'SELECT chapter_text FROM tbl_chapter WHERE chapter_id = ? LIMIT 1';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Error in finding the chapter. Please try again later.'
            });
        }

        if (!result.length) {
            return res.json({
                success: false,
                message: 'No chapter found. Please don\'t edit the URL.'
            });
        } else {
            let sql = 'DELETE FROM tbl_chapter WHERE chapter_id = ?';
            db.query(sql, [id], (err, sql) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Error in deleting the chapter. Please try again later.'
                    });
                }

                return res.json({
                    success: true,
                    message: 'Chapter has been deleted.'
                });
            });
        }
    });
});

module.exports = router;
