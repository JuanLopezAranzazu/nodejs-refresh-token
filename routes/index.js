const express = require("express");

//routes
const authRouter = require("./auth.router");
const newAuthRouter = require("./new-auth.router");
const userRouter = require("./user.router");

function routes(app) {
  const router = express.Router();
  app.use("/api/v1", router);
  router.use("/auth", authRouter);
  router.use("/new-auth", newAuthRouter);
  router.use("/user", userRouter);
}

module.exports = routes;
