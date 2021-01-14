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

// GET ALL AUTHORS
router.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorSchema.find(req.query);
    res.send(authors);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET SINGLE AUTHOR BY ID
router.get("/:id", async (req, res, next) => {
  try {
    const author = await AuthorSchema.findById(req.params.id);

    if (author) {
      res.send(author);
    } else {
      next(new Error());
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
