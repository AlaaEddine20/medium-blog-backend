const express = require("express");
// MODEL
const articleSchema = require("./schema");
// ROUTER
const router = express.Router();

// POST NEW ARTICLE
router.post("/", async (req, res, next) => {
  try {
    const newArticle = new articleSchema(req.body, {
      runValidators: true,
      new: true,
    });
    const { _id } = await newArticle.save();

    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET ARTICLES
router.get("/", async (req, res, next) => {
  try {
    const articles = await articleSchema.find();

    res.send(articles);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET ARTICLE BY ID
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await articleSchema.findById(id);
    if (article) {
      res.send(article);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("While reading articles list a problem occurred!");
  }
});

// EDIT ARTICLE
router.put("/:id", async (req, res, next) => {
  try {
    const updatedArticle = await articleSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );

    if (updatedArticle) {
      res.send(updatedArticle);
    } else {
      const error = new Error(`Article with ${req.params.id} not found!`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE AN ARTICLE
router.delete("/:id", async (req, res, next) => {
  try {
    const articleToDelete = await articleSchema.findByIdAndDelete(
      req.params.id
    );
    if (articleToDelete) {
      res.send("Deleted");
    } else {
      const error = new Error(`Article with ${req.params.id} id not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
