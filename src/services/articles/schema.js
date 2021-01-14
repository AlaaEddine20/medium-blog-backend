// MONGOOSE
const { Schema, model } = require("mongoose");
// SCHEMA
const articleModel = new Schema(
  {
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
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    cover: {
      type: String,
      required: true,
    },
    reviews: [
      {
        text: String,
        user: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Article", articleModel);
