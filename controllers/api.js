const { fetchEndPoints } = require("../models/api");

const getEndPoints = (req, res, next) => {
  fetchEndPoints(`${__dirname}/../endpoints.json`, "utf8")
    .then(file => {
      res.status(200).send(file);
    })
    .catch(next);
};

module.exports = { getEndPoints };
