const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// import ListSchema
const ListSchema = require('./list');

const BoardSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  lists: [ListSchema]
});

const Board = mongoose.model('Board', BoardSchema);

module.exports = Board;