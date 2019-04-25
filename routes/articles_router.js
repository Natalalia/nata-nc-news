const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  updateVote,
  getAllArticleComments
} = require("../controllers/articles");

articlesRouter.get("/", getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateVote);

articlesRouter.get("/:article_id/comments", getAllArticleComments);

module.exports = articlesRouter;
