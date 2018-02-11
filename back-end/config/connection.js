const mysql = require('mysql');

// Load keys
const keys = require('./keys');

const db_config = {
    connectionLimit : 10,
    host            : keys.host,
    user            : keys.user,
    password        : keys.password,
    database        : keys.database
}

const db = mysql.createPool(db_config);

module.exports = db;