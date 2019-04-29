const usersRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { getUser, postUser, getAllUsers } = require("../controllers/users");

usersRouter
  .route("/")
  .get(getAllUsers)
  .post(postUser)
  .all(methodNotAllowed);

usersRouter
  .route("/:username")
  .get(getUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
