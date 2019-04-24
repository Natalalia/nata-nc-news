const {
  fetchAllArticles,
  fetchArticle,
  incrementVote
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
  incrementVote(req.params.article_id, req.body.inc_votes).then(article => {
    res.status(200).send({ article });
  });
};

module.exports = { getAllArticles, getArticleById, updateVote };
