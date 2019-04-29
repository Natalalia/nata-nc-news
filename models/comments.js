const connection = require("../db/connection");

const fetchComment = comment_id => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .then(comments => {
      if (comments.length !== 0) {
        return comments[0];
      }
      return Promise.reject({ msg: "Comment Not Found", status: 404 });
    });
};

const changeVote = (comment_id, vote) => {
  if (vote === undefined) {
    vote = 0;
  }
  return connection
    .select("votes")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .then(votes => {
      const updatedVotes = votes[0]["votes"] + vote;
      return connection("comments")
        .where("comment_id", "=", comment_id)
        .update({ votes: updatedVotes })
        .returning("*")
        .then(comments => {
          return comments[0];
        });
    });
};

const removeComment = comment_id => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del();
};

const countComments = ({ article_id }) => {
  return connection("comments")
    .count("comment_id")
    .where({ article_id })
    .then(total => {
      return parseInt(total[0]["count"]);
    });
};

module.exports = { changeVote, removeComment, fetchComment, countComments };
