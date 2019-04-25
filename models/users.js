const connection = require("../db/connection");

const fetchUser = username => {
  return Promise.resolve({ username: username });
};

module.exports = { fetchUser };
