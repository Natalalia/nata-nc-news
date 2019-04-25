const { fetchUser } = require("../models/users");

const getUser = (req, res, next) => {
  const username = req.params.username;
  fetchUser(username).then(user => {
    res.status(200).send({ user });
  });
};

module.exports = { getUser };
