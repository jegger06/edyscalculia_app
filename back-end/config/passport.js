const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('./connection');

const keys = require('./keys');

module.exports = function(passport) {
  let opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = keys.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log(jwt_payload);
    let sql = 'SELECT * FROM tbl_account WHERE account_username = ? LIMIT 1';
    db.query(sql, [jwt_payload.username], (err, result) => {
        if (err) {
            return done(err, false)
        }

        if (result.length) {
            return done(null, result);
        } else {
            return done(null, false);
        }
    });
  }));
}