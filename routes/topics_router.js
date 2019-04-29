const topicsRouter = require("express").Router();
const { getAllTopics, postTopic } = require("../controllers/topics");
const { methodNotAllowed } = require("../errors");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .post(postTopic)
  .all(methodNotAllowed);

module.exports = topicsRouter;
