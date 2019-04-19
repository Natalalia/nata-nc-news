const { topicsData, usersData } = require("../data");

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics")
        .insert(topicsData)
        .returning("*");
    })
    .then(topicsRows => {
      console.log(topicsRows);
      return knex("users")
        .insert(usersData)
        .returning("*");
    })
    .then(usersRows => {
      console.log(usersRows);
    });
};
