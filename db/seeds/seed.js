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
  return (
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      /*
      .then(() => {
        return Promise.all([topicsData, usersData]).then(([topics, users]) => {
          return knex
            .insert(topics)
            .into("topics")
            .returning("*")
            .insert(users)
            .into("users")
            .returning("*");
        });
      })
      */

      .then(() => {
        return knex("topics")
          .insert(topicsData)
          .returning("*");
      })
      .then(() => {
        return knex("users")
          .insert(usersData)
          .returning("*");
      })

      .then(() => {
        const newArticlesDate = newFormatDate(articlesData);
        return knex("articles")
          .insert(newArticlesDate)
          .returning("*");
      })
      .then(articlesRow => {
        const newCommentsDate = newFormatDate(commentsData);
        const newKeyComments = changeKey(
          newCommentsDate,
          "created_by",
          "author"
        );
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
      })
  );
};
