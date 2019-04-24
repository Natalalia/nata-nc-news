const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  updateVote
} = require("../controllers/articles");

articlesRouter.get("/", getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateVote);

module.exports = articlesRouter;
