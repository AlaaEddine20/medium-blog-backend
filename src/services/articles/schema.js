// MONGOOSE
const { Schema } = require("mongoose");
const mongoose = require("mongoose");
// SCHEMA
const articleSchema = new Schema({
  headline: {
    type: String,
    required: true,
  },
  subHead: String,
  content: {
    type: String,
    required: true,
  },
  category: {
    type: {
      name: String,
      img: String,
    },
    required: true,
  },
  author: {
    name: String,
    img: String,
  },
  cover: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Article", articleSchema);
