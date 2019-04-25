const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  updateVote,
  getAllArticleComments,
  postComment
} = require("../controllers/articles");

articlesRouter.get("/", getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateVote);

articlesRouter
  .route("/:article_id/comments")
  .get(getAllArticleComments)
  .post(postComment);

module.exports = articlesRouter;
