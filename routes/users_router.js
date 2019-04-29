const usersRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { getUser, postUser } = require("../controllers/users");

usersRouter.route("/").post(postUser);

usersRouter
  .route("/:username")
  .get(getUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
