const { fetchAllTopics } = require("../models/topics");

const getAllTopics = (req, res, next) => {
  fetchAllTopics();
};

module.exports = { getAllTopics };
