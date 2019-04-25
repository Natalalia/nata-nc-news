const commentsRouter = require("express").Router();
const { updateVote } = require("../controllers/comments");

commentsRouter.patch("/:comment_id", updateVote);

module.exports = commentsRouter;
