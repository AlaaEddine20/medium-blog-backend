const { Schema, model } = require("mongoose");

const AuthorSchema = new Schema({
  name: String,
  img: String,
});

module.exports = model("Author", AuthorSchema);
