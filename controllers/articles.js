const {
  fetchAllArticles,
  fetchArticle,
  incrementVote,
  fetchArticleComments,
  createComment
} = require("../models/articles");

const getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not request found"
        });
      }

      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  fetchArticle(req.params.article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      if (err === "Article not found") {
        res.status(404).send({ msg: err });
      } else {
        next(err);
      }
    });
};

const updateVote = (req, res, next) => {
  incrementVote(req.params.article_id, req.body.inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const getAllArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  fetchArticleComments(article_id, sort_by, order)
    .then(comments => {
      if (comments.length === 0) {
        res.status(404).send({ msg: "Article with no comments" });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

const postComment = (req, res, next) => {
  createComment(req.params.article_id, req.body.username, req.body.body)
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(next);
};

module.exports = {
  getAllArticles,
  getArticleById,
  updateVote,
  getAllArticleComments,
  postComment
};
