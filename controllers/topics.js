const { fetchAllTopics, createTopic } = require("../models/topics");

const getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const postTopic = (req, res, next) => {
  createTopic();
};

module.exports = { getAllTopics, postTopic };
