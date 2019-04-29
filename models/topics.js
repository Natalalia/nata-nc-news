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

const createTopic = (description, slug) => {
  const newTopic = {
    description: description,
    slug: slug
  };
  return connection("topics")
    .insert(newTopic)
    .returning("*");
};

module.exports = { fetchAllTopics, fetchTopic, createTopic };
