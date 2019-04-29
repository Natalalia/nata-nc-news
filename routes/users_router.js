const usersRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { getUser, postUser } = require("../controllers/users");

usersRouter
  .route("/")
  .post(postUser)
  .all(methodNotAllowed);

usersRouter
  .route("/:username")
  .get(getUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
