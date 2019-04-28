const {
  fetchAllArticles,
  fetchArticle,
  incrementVote,
  fetchArticleComments,
  createComment
} = require("../models/articles");

const { fetchUser } = require("../models/users");

const { fetchTopic } = require("../models/topics");

const queriesPromises = (username, slug) => {
  const checkQueries = [];
  if (username) {
    checkQueries.push(fetchUser(username));
  } else {
    checkQueries.push("no author request");
  }
  if (slug) {
    checkQueries.push(fetchTopic(slug));
  } else {
    checkQueries.push("no topic request");
  }
  return checkQueries;
};

const getAllArticles = (req, res, next) => {
  const author = req.query.author;
  const topic = req.query.topic;
  const limit = parseInt(req.query.limit);
  const p = parseInt(req.query.p);
  if (req.query.limit && isNaN(limit)) {
    return next({
      status: 400,
      msg: "Bad Request"
    });
  }
  if (req.query.p && isNaN(p)) {
    return next({
      status: 400,
      msg: "Bad Request"
    });
  }
  const checkedQueries = queriesPromises(author, topic);
  return Promise.all(checkedQueries)
    .then(([author, topic]) => {
      if (!author) {
        return Promise.reject({
          status: 404,
          msg: "Author Not Found"
        });
      }
      if (!topic) {
        return Promise.reject({
          status: 404,
          msg: "Topic Not Found"
        });
      }
      return fetchAllArticles(req.query).then(articles => {
        res.status(200).send({ articles });
      });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  fetchArticle(req.params.article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const updateVote = (req, res, next) => {
  fetchArticle(req.params.article_id)
    .then(() => {
      return incrementVote(req.params.article_id, req.body.inc_votes);
    })
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const getAllArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  fetchArticle(article_id)
    .then(() => {
      return fetchArticleComments(article_id, sort_by, order);
    })
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const postComment = (req, res, next) => {
  createComment(req.params.article_id, req.body.username, req.body.body)
    .then(([comment]) => {
      if (comment["body"] === "") {
        return Promise.reject({
          status: 400,
          msg: "Bad Request"
        });
      }
      res.status(201).send({ comment });
    })
    .catch(next);
};

module.exports = {
  getAllArticles,
  getArticleById,
  updateVote,
  getAllArticleComments,
  postComment
};
