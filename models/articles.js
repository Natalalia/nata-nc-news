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
      const articlesWithCounter = articlesNewKey.map(article => {
        const article_id = article["article_id"];
        return connection("comments")
          .count("article_id")
          .where({ article_id: article_id })
          .then(result => {
            article["comment_count"] = parseInt(result[0]["count"]);
            return article;
          });
      });
      return Promise.all(articlesWithCounter);
    });
};

module.exports = { fetchAllArticles };
