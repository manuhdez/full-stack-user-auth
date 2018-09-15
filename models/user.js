const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// import the BoardSchema to insert it inside the UserSchema
const BoardSchema = require('./board');

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

module.exports = User;