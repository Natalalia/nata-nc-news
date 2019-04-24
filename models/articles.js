const connection = require("../db/connection");
const { createNewKey } = require("../utils/formating-functions");

const getCountComments = function(article_id) {
  return connection("comments")
    .count("article_id")
    .where({ article_id: article_id })
    .then(result => {
      return parseInt(result[0]["count"]);
    });
};

const fetchAllArticles = ({ author, topic, sort_by, order }) => {
  return connection
    .select("article_id", "author", "created_at", "title", "topic", "votes")
    .from("articles")
    .modify(query => {
      if (author) query.where({ author });
      if (topic) query.where({ topic });
    })
    .orderBy(sort_by || "created_at", order || "desc")
    .then(articles => {
      const articlesWithCounter = articles.map(article => {
        return getCountComments(article["article_id"]).then(comment_counter => {
          article["comment_count"] = comment_counter;
          return article;
        });
      });
      return Promise.all(articlesWithCounter);
    });
};

const fetchArticle = () => {};

module.exports = { fetchAllArticles, fetchArticle };
