const mysql = require('mysql');

// Load keys
const keys = require('./keys');

const db_config = {
    connectionLimit : 50,
    host            : keys.host,
    user            : keys.user,
    password        : keys.password,
    database        : keys.database
}

let db;

function handleDisconnect() {
    db = mysql.createPool(db_config);

    db.on('acquire', function (connection) {
      console.log('Connection %d acquired', connection.threadId);
    });

    db.on('release', function (connection) {
      console.log('Connection %d released', connection.threadId);
    });

    // db.connect((err) => {
    //     if (err) {
    //        console.log('Error when connecting to db: ', err);
    //        setTimeout(handleDisconnect, 2000);
    //     }
    //     console.log('MySql Connected...');
    // });

    db.on('error', (err) => {
      console.log('DB Error: ', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect();
      } else {
        throw err;
      }
    });

    // Log queries on console
    db.on('enqueue', (sequence) => {
      console.log(sequence.sql);
    });
}

handleDisconnect();

// // Create mysql connection
// const db = mysql.createConnection({
//     host     : keys.host,
//     user     : keys.user,
//     password : keys.password,
//     database : keys.database
// });

// // Connect
// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log('MySql Connected...');
// });

// // Log queries on console
// db.on('enqueue', (sequence) => {
//     console.log(sequence.sql);
// })

module.exports = db;