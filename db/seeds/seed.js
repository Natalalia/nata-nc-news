const {
  topicsData,
  usersData,
  articlesData,
  commentsData
} = require("../data");
const {
  newFormatDate,
  changeKey,
  createObjectRef,
  formatData
} = require("../../utils/formating-functions");

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
      return knex("users")
        .insert(usersData)
        .returning("*");
    })
    .then(usersRows => {
      const newArticlesDate = newFormatDate(articlesData);
      return knex("articles")
        .insert(newArticlesDate)
        .returning("*");
    })
    .then(articlesRow => {
      const newCommentsDate = newFormatDate(commentsData);
      const newKeyComments = changeKey(newCommentsDate, "created_by", "author");
      const commentsRef = createObjectRef(articlesRow, "title", "article_id");
      const formatedComments = formatData(
        newKeyComments,
        commentsRef,
        "article_id",
        "belongs_to"
      );

      return knex("comments")
        .insert(formatedComments)
        .returning("*");
    });
};
