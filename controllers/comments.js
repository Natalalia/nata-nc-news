const { changeVote, eraseComment } = require("../models/comments");

const updateVote = (req, res, next) => {
  changeVote(req.params.comment_id, req.body.inc_votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  eraseComment();
};

module.exports = { updateVote, deleteComment };
