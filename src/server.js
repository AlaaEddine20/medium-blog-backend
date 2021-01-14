const express = require("express");
const { join } = require("path");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");
// ERROR HANDLERS
const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");

const articlesRouter = require("./services/articles/index");
const authorsRouter = require("./services/authors/index");

const server = express();

const port = process.env.PORT;

const staticFolderPath = join(__dirname, "../public");
server.use(express.static(staticFolderPath));
server.use(express.json());
server.use(cors());

// ROUTES
server.use("/articles", articlesRouter);
server.use("/authors", authorsRouter);

// ERROR HANDLERS MIDDLEWARES
server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

// CONNECT MONGOOSE DRIVER
mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Server is running on port", port);
    })
  )
  .catch((error) => console.log(error));
