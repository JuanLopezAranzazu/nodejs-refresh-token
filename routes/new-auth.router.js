const express = require("express");
const newAuthRouter = express.Router();

//controllers
const {
  registerUser,
  userLogin,
  token,
  whoAmI,
} = require("../controllers/new-auth.controller");
//middlewares
const verifyJWT = require("./../middlewares/verifyJWT");

newAuthRouter.post("/register", registerUser);
newAuthRouter.post("/login", userLogin);
newAuthRouter.post("/token", token);
newAuthRouter.get("/whoami", verifyJWT, whoAmI);

module.exports = newAuthRouter;
