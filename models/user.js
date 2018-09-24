const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// user object template
const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: false
  }
});

// User custom methods
// User authentication
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ 'email': email })
      .exec( (error, user) => {
        if (error) {
          // handles if there is an unexpected error
          return callback(error);
        } else if (!user) {
          // handles if the user you search for doesn't exist in the database
          const err = new Error('[ERROR] - User not found.');
          err.status = 401;
          return callback(err);
        } else {
          // if there has been no error compare the typed password with the hashed password
          bcrypt.compare(password, user.password, (error, result) => {
            if (result) {
              // pass null as a first parameter becouse the callback expects an error object
              return callback(null, user);
            } else {
              return callback();
            }
        });
      }
    });
}

// Execute password encryption before saving a new user to the database
UserSchema.pre('save', function(next) {
  // point user var to this keyword to avoid binding problems
  const user = this;
  // run password encryption
  bcrypt.hash(user.password, 10, function(err, hashed) {
    if (err) {
      return next(err);
    }
    user.password = hashed;
    next();
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;