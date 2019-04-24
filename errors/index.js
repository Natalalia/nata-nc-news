exports.badRequest = (err, req, res, next) => {
  const psqlCodes = ["42703", "22P02"];
  //if (err.status) res.status(err.status).send({ msg: err.msg });
  if (psqlCodes.includes(err.code))
    res.status(400).send({ msg: "Bad Request" });
  else next(err);
};

exports.routeNotFound = (err, req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
