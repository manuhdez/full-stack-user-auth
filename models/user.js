const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// import the BoardSchema to insert it inside the UserSchema
const BoardSchema = require('./board');

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
    trim: true
  },
  boards: [BoardSchema]
});

const User = mongoose.model('User', UserSchema);

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

UserSchema.post('save', function(next) {
  console.log('A new user has been saved!');
});

module.exports = User;