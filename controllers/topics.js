const { fetchAllTopics } = require("../models/topics");

const getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = { getAllTopics };
