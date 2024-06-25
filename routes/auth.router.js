const express = require("express");
const authRouter = express.Router();

//controllers
const {
  registerUser,
  userLogin,
  token,
  whoAmI,
} = require("../controllers/auth.controller");
//middlewares
const verifyJWT = require("./../middlewares/verifyJWT");

authRouter.post("/register", registerUser);
authRouter.post("/login", userLogin);
authRouter.post("/token", token);
authRouter.get("/whoami", verifyJWT, whoAmI);

module.exports = authRouter;
