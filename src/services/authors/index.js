const express = require("express");
// SCHEMA
const AuthorSchema = require("./schema");
// ROUTER
const router = express.Router();

// POST
router.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorSchema(req.body);
    const { _id } = await newAuthor.save();
    res.send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
