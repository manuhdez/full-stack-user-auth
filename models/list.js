const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  items: Array
});

const List = mongoose.model('List', ListSchema);

module.exports = List;