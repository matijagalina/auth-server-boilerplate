// to authentificate user when visiting protected routes
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const localStrategy = require('passport-local');
const User = require('../models/user');
const config = require('../config');

// set up options for startegies
const jwtOptions = {
  // where to look in request for jwt key
  // extract from header authorization
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};

const localOptions = {
  // look at email prop inside request
  usernameField: 'email',
};

// create JWT startegy
// for authenticated routes
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // payload is decoded jwt token
  // done is callback function called after successfull auth

  // see if user.id from payload exist in database
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }

    // if user exist call done with user object
    if(user) {
      done(null, user)
    // else call done without user object
    } else {
      done(null, false);
    }
  });
});

// create local startegy
// for signin
const localLogin = new localStrategy(localOptions, function(email, password, done) {
  // verify this email and password
  // call done with user if the data is correct
  // othervise call done with false
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }

    // compare hashed user.password and inputed password
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    })
  })
})


// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
