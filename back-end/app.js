const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(express.static(__dirname + '/'));

// cors Middleware
app.use(cors());

// body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Load Routes
const users = require('./routes/user.route');
const accounts = require('./routes/account.route');
const chapters = require('./routes/chapter.route');
const uploads = require('./routes/upload.route');

// Use Routes
app.use('/api/user', users);
app.use('/api/account', accounts);
app.use('/api/chapter', chapters);
app.use('/api/upload', uploads);

// Create a folder for uploading files
const filesDir = path.join(path.dirname(require.main.filename), 'uploads');

if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

const port = process.env.PORT || 7000;

app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});