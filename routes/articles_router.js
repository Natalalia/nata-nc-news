const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const {
  getAllArticles,
  getArticleById,
  updateVote,
  getAllArticleComments,
  postComment,
  postArticle,
  deleteArticle
} = require("../controllers/articles");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .post(postArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateVote)
  .delete(deleteArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .get(getAllArticleComments)
  .post(postComment)
  .all(methodNotAllowed);

module.exports = articlesRouter;
