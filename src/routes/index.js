const kanjiRouter = require("./kanji");
const siteRouter = require("./site");
const userRouter = require("./user");

function route(app) {
  app.use("/user", userRouter);

  app.use("/kanji", kanjiRouter);

  app.use("/", siteRouter);
}

module.exports = route;
