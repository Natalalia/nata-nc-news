const { fetchAllArticles } = require("../models/articles");

const getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query).then(articles => {
    res.status(200).send({ articles });
  });
};

module.exports = { getAllArticles };
