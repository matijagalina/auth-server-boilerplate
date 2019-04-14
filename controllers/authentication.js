const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

function tokenForUser(user) {
  const timestamp = new Date().getTime();

  // sub -> subject, iat -> issued at time
  return jwt.encode({
    sub: user.id,
    iat: timestamp,
  }, config.secret);
}

const emailRegex = /^[a-z0-9!#$%&'*+/=?\^_`{|}~\-]+(?:.[a-z0-9!#$%&'*+/=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/i;

exports.signup = function(req, res, next) {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(422).send({
      error: 'You must provide email and password'
    });
  }

  const isEmailValid = emailRegex.test(email);

  if (!isEmailValid) {
    return res.status(422).send({
      error: 'Email is not valid'
    });
  }

  // see if the user with a given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    // if user exists, return error
    if (existingUser) {
      return res.status(422).send({
        error: 'Email is in use'
      })
    }

    // if user doesnt exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      // respond to request indicating that the user is created
      res.json({
        token: tokenForUser(user),
      });

      console.log(user);
    });

  });
};

exports.signin = function(req, res, next) {
  // user had their email and password authenticated through local passport strategy
  // we just need to give them token

  // passport after succesfull local signin strategy adds user to request object
  res.send({
    token: tokenForUser(req.user),
  })
};
