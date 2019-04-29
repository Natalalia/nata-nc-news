const connection = require("../db/connection");

const fetchUser = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", "=", username)
    .then(users => {
      const user = users[0];
      return user;
    });
};

const createUser = () => {};

module.exports = { fetchUser, createUser };
