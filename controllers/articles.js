const { fetchAllArticles } = require("../models/articles");

const getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      /*
      if (!articles) {
        return Promise.reject({
          status: 400,
          msg: "Not request found"
        });
      }
      */
      res.status(200).send({ articles });
    })
    .catch(next);
};

module.exports = { getAllArticles };
