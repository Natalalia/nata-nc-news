const { fetchAllArticles } = require("../models/articles");

const getAllArticles = (req, res, next) => {
  fetchAllArticles().then(articles => {
    res.status(200).send({ articles });
  });
};

module.exports = { getAllArticles };
