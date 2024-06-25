const express = require("express");
const userRouter = express.Router();

//controllers
const {
  findAllUsers,
  findOneUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
//middlewares
const verifyJWT = require("./../middlewares/verifyJWT");
const verifyRoles = require("./../middlewares/verifyRoles");

userRouter.get("/", verifyJWT, verifyRoles("admin"), findAllUsers);
userRouter.get("/:id", verifyJWT, verifyRoles("admin"), findOneUser);
userRouter.put("/:id", verifyJWT, verifyRoles("admin", "user"), updateUser);
userRouter.delete("/:id", verifyJWT, verifyRoles("admin", "user"), deleteUser);

module.exports = userRouter;
