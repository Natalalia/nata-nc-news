const apiRouter = require("express").Router();
const topicsRouter = require("./topics_router");
const articlesRouter = require("./articles_router");
const commentsRouter = require("./comments_router");
const { methodNotAllowed } = require("../errors");

apiRouter
  .route("/")
  .get((req, res) => res.send({ ok: true }))
  .all(methodNotAllowed);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
