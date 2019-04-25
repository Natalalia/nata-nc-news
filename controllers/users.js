const { fetchUser } = require("../models/users");

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

module.exports = { getUser };
