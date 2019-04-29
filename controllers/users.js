const { fetchUser, createUser, fetchAllUsers } = require("../models/users");

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
      if (user["username"] === "" || user["name"] === "") {
        return Promise.reject({
          status: 400,
          msg: "Bad Request"
        });
      }
      res.status(201).send({ user });
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  fetchAllUsers(req.query)
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

module.exports = { getUser, postUser, getAllUsers };
