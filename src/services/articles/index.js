const express = require("express");
const mongoose = require("mongoose");
// MODEL
const articleModel = require("./schema");
// ROUTER
const router = express.Router();

// POST NEW ARTICLE
router.post("/", async (req, res, next) => {
  try {
    const newArticle = new articleModel(req.body);
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
    const articles = await articleModel.find();

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
    const article = await articleModel.findById(id);
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
    const updatedArticle = await articleModel.findByIdAndUpdate(
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
    const articleToDelete = await articleModel.findByIdAndDelete(req.params.id);
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

// ADD REVIEW TO AN ARTICLE
router.post("/:id/reviews", async (req, res, next) => {
  try {
    const reviewToAdd = { ...req.body, date: new Date() };

    const updated = await articleModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: reviewToAdd,
        },
      },
      { runValidators: true, new: true }
    );
    res.status(201).send(updated);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET all reviews of an article
router.get("/:id/reviews", async (req, res, next) => {
  try {
    // destructure the reviews proprety from the article
    const { reviews } = await articleModel.findById(req.params.id, {
      reviews: 1, // send back the reviews (reviews = true)
      _id: 0, // don't send the id
    });
    res.send(reviews);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET all reviews of the specified article
router.get("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    // destructure reviews property from the article
    const { reviews } = await articleModel.findOne(
      {
        // convert the id into an objectId
        // First parameter of the method: query
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        // Second parameter of the method: projection
        // in this param i will always get the _id field unless i specify to not (in this case don't return it)
        _id: 0,
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
          // this mongo method returns only the element that matches the id condition from params
        },
      }
    );

    if (reviews && reviews.length > 0) {
      res.send(reviews[0]);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE a specific review of the specified article
router.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const modifiedArticle = await articleModel.findByIdAndUpdate(
      /* findByIdAndUpdate because i need to remove just an object from the reviews array of the article
    not all the article */
      req.params.id,
      {
        // $pull is the mongo delete method
        $pull: {
          // delete the object that matches the reviewId in the params
          reviews: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      },
      { new: true } // this is needed so mongo won't send me back the older object
    );
    res.send(modifiedArticle);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// EDIT a specific review of the specified article
router.put("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    // destructure reviews property from the article
    const { reviews } = await articleModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        _id: 0,
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      }
    );

    const selectedArticle = reviews[0].toObject();

    if (reviews && reviews.length > 0) {
      // merge old article with the new one
      const articleToReplace = { ...selectedArticle, ...req.body };

      // replace the article's reviews with the modified one
      const modifiedArticle = await articleModel.findOneAndUpdate(
        /* If i use findByIdAndUpdate i'll be retrieving the entire user.
        here i prefer to retrieve just the specific bok of that user */
        {
          _id: mongoose.Types.ObjectId(req.params.id),
          // search through the ids of the reviews and target the one that matches the params
          "reviews._id": mongoose.Types.ObjectId(req.params.reviewId),
        },
        {
          // change the field of the modified property
          $set: { "reviews.$": articleToReplace },
        },
        {
          runValidators: true,
          new: true,
        }
      );
    }
    res.send(modifiedArticle);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
