const express = require('express');
const passport = require('passport');
const AnonymousStrategy = require('passport-anonymous').Strategy;
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
passport.use(new AnonymousStrategy());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Set global variable
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Load Routes
const users = require('./routes/user.route');
const accounts = require('./routes/account.route');
const chapters = require('./routes/chapter.route');
const uploads = require('./routes/upload.route');
const lessons = require('./routes/lesson.route');
const difficulties = require('./routes/difficulty.route');
const questionRanges = require('./routes/question-range.route');
const questionTypes = require('./routes/question-type.route');
const questions = require('./routes/question.route');
const scores = require('./routes/score.route');

// Use Routes
app.use('/api/user', users);
app.use('/api/account', accounts);
app.use('/api/chapter', chapters);
app.use('/api/upload', uploads);
app.use('/api/lesson', lessons);
app.use('/api/difficulty', difficulties);
app.use('/api/question-range', questionRanges);
app.use('/api/question-type', questionTypes);
app.use('/api/question', questions);
app.use('/api/score', scores);

// Create a folder for uploading files
const filesDir = path.join(path.dirname(require.main.filename), 'uploads');

if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});