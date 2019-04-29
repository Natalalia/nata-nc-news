exports.handlePsqlError = (err, req, res, next) => {
  const psqlCodes = {
    "42703": {
      status: 400,
      msg: "Bad Request"
    },
    "22P02": {
      status: 400,
      msg: "Bad Request"
    },
    "23502": {
      status: 400,
      msg: "Bad Request"
    },
    "23503": {
      status: 404,
      msg: "Author Not Found"
    },
    "2201W": {
      status: 400,
      msg: "Bad Request"
    },
    "2201X": {
      status: 400,
      msg: "Bad Request"
    }
  };

  if (psqlCodes[err.code]) {
    res
      .status(psqlCodes[err.code].status)
      .send({ msg: psqlCodes[err.code].msg });
  } else {
    next(err);
  }
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.routeNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
