const { articlesData } = require("../db/data");

const newArticlesDate = articlesData.map(element => {
  element["created_at"] = new Date(element["created_at"]);
  return element;
});

module.exports = newArticlesDate;
