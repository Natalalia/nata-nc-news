const express = require("express");
const apiRouter = require("./routes/api");
const cors = require("cors");
const {
  routeNotFound,
  handle500,
  handlePsqlError,
  handleCustomError
} = require("./errors");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFound);

app.use(handlePsqlError);

app.use(handleCustomError);

app.use(handle500);

module.exports = app;
