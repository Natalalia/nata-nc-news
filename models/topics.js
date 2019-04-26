const connection = require("../db/connection");

const fetchAllTopics = () => {
  return connection.select("*").from("topics");
};

const fetchTopic = slug => {
  return connection
    .select("*")
    .from("topics")
    .where("slug", "=", slug)
    .then(topics => {
      return topics[0];
    });
};

module.exports = { fetchAllTopics, fetchTopic };
