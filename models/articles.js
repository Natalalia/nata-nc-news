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
      const article_id = articlesNewKey[0]["article_id"];
      return connection("comments")
        .count("article_id")
        .where({ article_id: article_id })
        .then(result => {
          articlesNewKey[0]["comment_count"] = parseInt(result[0]["count"]);
          return articlesNewKey;
        });
    });
};

module.exports = { fetchAllArticles };
