const express = require('express');

require('./config/connection');

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected...');
});

// Load Routes
const users = require('./routes/user.route');

const app = express();

// Use Routes
app.use('/api/user', users);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});