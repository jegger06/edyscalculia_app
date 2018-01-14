const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

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

// Use Routes
app.use('/api/user', users);
app.use('/api/account', accounts);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});