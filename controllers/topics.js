const { fetchAllTopics, createTopic } = require("../models/topics");

const getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const postTopic = (req, res, next) => {
  createTopic(req.body.description, req.body.slug)
    .then(([topic]) => {
      if (topic["slug"] === "") {
        return Promise.reject({
          status: 400,
          msg: "Bad Request"
        });
      }
      res.status(201).send({ topic });
    })
    .catch(next);
};

module.exports = { getAllTopics, postTopic };
