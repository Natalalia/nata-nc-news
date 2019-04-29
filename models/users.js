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

const createUser = (username, avatar, name) => {
  const newUser = {
    username: username,
    avatar_url: avatar,
    name: name
  };
  return connection("users")
    .insert(newUser)
    .returning("*");
};

module.exports = { fetchUser, createUser };
