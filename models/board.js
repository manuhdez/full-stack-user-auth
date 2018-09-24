const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// import ListSchema
const List = require('./list');
const ListSchema = List.schema;

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