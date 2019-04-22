const { topicsData, usersData } = require("../data");
const newArticlesData = require("../../utils/newDate");

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
      //console.log(topicsRows);
      return knex("users")
        .insert(usersData)
        .returning("*");
    })
    .then(usersRows => {
      //console.log(usersRows);
      console.log(newArticlesData);
      return knex("articles")
        .insert(newArticlesData)
        .returning("*");
    });
};
