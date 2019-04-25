const connection = require("../db/connection");

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

const fetchArticle = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .then(articles => {
      if (articles.length !== 0) {
        const article = articles[0];
        return getCountComments(article["article_id"]).then(comment_counter => {
          article["comment_count"] = comment_counter;
          return article;
        });
      }
      return Promise.reject("Article not found");
    });
};

const incrementVote = (article_id, vote) => {
  return connection
    .select("votes")
    .from("articles")
    .where("article_id", "=", article_id)
    .then(votes => {
      const updatedVotes = votes[0]["votes"] + vote;
      return connection("articles")
        .where("article_id", "=", article_id)
        .update({ votes: updatedVotes })
        .returning("*")
        .then(articles => {
          return articles[0];
        });
    });
};

const fetchAllArticleComments = () => {};

module.exports = {
  fetchAllArticles,
  fetchArticle,
  incrementVote,
  fetchAllArticleComments
};
