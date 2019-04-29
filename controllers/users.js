const { fetchUser, createUser } = require("../models/users");

const getUser = (req, res, next) => {
  const username = req.params.username;
  fetchUser(username)
    .then(user => {
      if (user === undefined) {
        return Promise.reject({
          status: 404,
          msg: "User not found"
        });
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

const postUser = (req, res, next) => {
  createUser(req.body.username, req.body.avatar_url, req.body.name)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(next);
};

module.exports = { getUser, postUser };
