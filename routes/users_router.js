const usersRouter = require("express").Router();
const { getUser } = require("../controllers/users");

usersRouter.get("/:username", getUser);

module.exports = usersRouter;
