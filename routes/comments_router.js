const commentsRouter = require("express").Router();
const { updateVote, deleteComment } = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .patch(updateVote)
  .delete(deleteComment);

module.exports = commentsRouter;
