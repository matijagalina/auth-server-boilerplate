const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

// define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true, // will be turned to lowercase before saving
  },
  password: String,
});

// on Save Hook, encrypt password
// before saving model, run this function
userSchema.pre('save', function(next) {
  // acces to user model
  // user is the instance of the user model
  const user = this;

  // generate a salt (string of random characters)
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash password using salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      // override plain text password with encrypted pasword
      user.password = hash;
      // continue and save the model
      next();
    })
  });
});

// add method on user object to compare two passwords
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  })
}

// create the model class
const ModelClass = mongoose.model('user', userSchema);

// export the model
module.exports = ModelClass;