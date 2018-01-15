const mysql = require('mysql');

// Load keys
const keys = require('./keys');

// Create mysql connection
const db = mysql.createConnection({
    host     : keys.host,
    user     : keys.user,
    password : keys.password,
    database : keys.database
});

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected...');
});

// Log queries on console
db.on('enqueue', (sequence) => {
    console.log(sequence.sql);
})

module.exports = db;