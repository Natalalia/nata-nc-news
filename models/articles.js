const connection = require("../db/connection");

const fetchAllArticles = ({ author, topic, sort_by, order, limit, p }) => {
  let offset = 0;
  if (p) {
    if (limit) {
      offset = limit * (p - 1);
    } else {
      offset = 10 * (p - 1);
    }
  }
  const counter = connection("comments")
    .count("article_id")
    .whereRaw("??=??", ["articles.article_id", "comments.article_id"])
    .as("comment_count");

  return connection
    .select(
      "article_id",
      "author",
      "created_at",
      "title",
      "topic",
      "votes",
      counter
    )
    .from("articles")
    .modify(query => {
      if (author) query.where({ author });
      if (topic) query.where({ topic });
    })
    .orderBy(sort_by || "created_at", order || "desc")
    .limit(limit || 10)
    .offset(offset)
    .then(articles => {
      return articles.map(article => {
        article["comment_count"] = parseInt(article["comment_count"]);
        return article;
      });
    });
};

const fetchArticle = article_id => {
  const counter = connection("comments")
    .count("article_id")
    .where({ article_id: article_id })
    .as("comment_count");
  return connection
    .select("*", counter)
    .from("articles")
    .where("article_id", "=", article_id)
    .then(articles => {
      if (articles.length !== 0) {
        return articles[0];
      }
      return Promise.reject({ msg: "Article Not Found", status: 404 });
    });
};

const incrementVote = (article_id, vote) => {
  if (vote === undefined) {
    vote = 0;
  }
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

const fetchArticleComments = (article_id, sort_by, order, limit, p) => {
  let offset = 0;
  if (p) {
    if (limit) {
      offset = limit * (p - 1);
    } else {
      offset = 10 * (p - 1);
    }
  }
  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .limit(limit || 10)
    .offset(offset);
};

const createComment = (article_id, username, body) => {
  const newPost = {
    author: username,
    body: body,
    article_id: article_id
  };
  return connection("comments")
    .insert(newPost)
    .returning("*");
};

const createArticle = (username, title, topic, body) => {
  const newPost = {
    author: username,
    title: title,
    topic: topic,
    body: body
  };
  return connection("articles")
    .insert(newPost)
    .returning("*")
    .then(([article]) => {
      const article_id = article["article_id"];
      const counter = connection("comments")
        .count("article_id")
        .where({ article_id: article_id })
        .as("comment_count");
      return connection
        .select("*", counter)
        .from("articles")
        .where("article_id", "=", article_id);
    });
};

module.exports = {
  fetchAllArticles,
  fetchArticle,
  incrementVote,
  fetchArticleComments,
  createComment,
  createArticle
};
