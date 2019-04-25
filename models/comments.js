const connection = require("../db/connection");

const changeVote = (comment_id, vote) => {
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

module.exports = { changeVote };
