const {
  topicsData,
  usersData,
  articlesData,
  commentsData
} = require("../data");
const { newFormatDate, changeKey } = require("../../utils/formating-functions");

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
      const newArticlesData = newFormatDate(articlesData);
      return knex("articles")
        .insert(newArticlesData)
        .returning("*");
    })
    .then(articlesRow => {
      //console.log(articlesRow);
      const newKeyComments = changeKey(commentsData, "created_by", "author");
      console.log(newKeyComments);
    });
};
