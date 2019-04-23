const connection = require("../db/connection");

const fetchAllArticles = () => {
  return connection
    .select("article_id", "author", "created_at", "title", "topic", "votes")
    .from("articles")
    .then(result => {
      const articlesNewKey = result.map(element => {
        element["comment_count"] = 0;
        return element;
      });
      return articlesNewKey;
    });
};

module.exports = { fetchAllArticles };
