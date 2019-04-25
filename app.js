const express = require("express");
const apiRouter = require("./routes/api");
const {
  routeNotFound,
  handle500,
  badRequest,
  resourceNotFound
} = require("./errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFound);

app.use(badRequest);

app.use(resourceNotFound);

app.use(handle500);

module.exports = app;
