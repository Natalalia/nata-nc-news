const commentsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { updateVote, deleteComment } = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .patch(updateVote)
  .delete(deleteComment)
  .all(methodNotAllowed);

module.exports = commentsRouter;
