const { changeVote } = require("../models/comments");

const updateVote = (req, res, next) => {
  changeVote();
};

module.exports = { updateVote };
