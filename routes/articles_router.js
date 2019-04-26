const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const {
  getAllArticles,
  getArticleById,
  updateVote,
  getAllArticleComments,
  postComment
} = require("../controllers/articles");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateVote)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .get(getAllArticleComments)
  .post(postComment);

module.exports = articlesRouter;
