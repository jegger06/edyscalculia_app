const express = require('express');
const router = express.Router();



router.get('/lists', (req, res) => {
    let sql = 'SELECT * FROM tbl_account';
    db.query(sql, (err, result) => {
        if (err) {
            console.log('Something wen\'t wrong fetching data from database...');
        }
        console.log(result);
        res.json({
            result
        });
    });
});

module.exports = router;