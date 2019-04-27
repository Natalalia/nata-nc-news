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
      const topics = knex("topics")
        .insert(topicsData)
        .returning("*");
      const users = knex("users")
        .insert(usersData)
        .returning("*");
      return Promise.all([topics, users]);
    })
    .then(() => {
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
