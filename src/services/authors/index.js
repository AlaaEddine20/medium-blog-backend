const express = require("express");
// SCHEMA
const AuthorSchema = require("./schema");
const articleModel = require("../articles/schema");
// ROUTER
const router = express.Router();

// POST
router.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorSchema(req.body);
    const articleId = req.body.author;
    const article = await articleModel.findByIdAndUpdate(articleId, {
      $push: { authors: newAuthor },
    });
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
      next(new Error(`Author ${req.body.name} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// EDIT AUTHOR
router.put("/:id", async (req, res, next) => {
  try {
    const authorToUpdate = await AuthorSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (authorToUpdate) {
      res.send(authorToUpdate);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE AUTHOR
router.delete("/:id", async (req, res, next) => {
  try {
    const authorToDelete = await AuthorSchema.findByIdAndDelete(req.params.id);

    if (authorToDelete) {
      res.send(`${req.body.name} Deleted!`);
    } else {
      next(`${req.params.id} Not found`);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
