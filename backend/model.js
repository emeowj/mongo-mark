const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: String,
  content: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  tags: [String],
});

const Note = mongoose.model('Note', noteSchema);

module.exports = {
  Note,
};
