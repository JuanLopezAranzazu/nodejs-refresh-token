const { config } = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// models
const User = require("../models/user.model");
const Role = require("../models/role.model");
const RefreshToken = require("../models/refreshToken.model");
// utils
const {
  saveRefreshToken,
  validateRefreshToken,
} = require("../utils/refreshToken");

const registerUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { email, password, ...rest } = body;
    // validar que el email no exista
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400).json({ message: `El correo ${email} ya existe` });
      return;
    }
    // encriptar la contraseña
    const hash = await bcrypt.hash(password, 10);

    const foundRole = await Role.findOne({ name: "user" });
    if (!foundRole) {
      res.status(400).json({ message: "El rol user no existe" });
      return;
    }

    // guardar el usuario en la base de datos
    const newUser = new User({
      ...rest,
      email,
      password: hash,
      roles: [foundRole._id],
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { body } = req;
    const { email, password } = body;
    // buscar el usuario en la base de datos
    const foundUser = await User.findOne({ email }).populate("roles");
    if (!foundUser) {
      return res.status(401).json({ error: "Error al autenticarse" });
    }
    // comparar contraseñas
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Error al autenticarse" });
    }
    // generar token
    const roles = foundUser.roles.map((role) => role.name);
    const user = { userId: foundUser._id };

    const accessToken = jwt.sign(user, config.secretKey, {
      expiresIn: config.jwtExpirationTime,
    });

    // guardar refreshToken en la base de datos
    const refreshToken = await saveRefreshToken(user.userId);
    console.log(refreshToken);
    res
      .status(200)
      .json({ accessToken, refreshToken: refreshToken.token, roles });
  } catch (error) {
    next(error);
  }
};

const token = async (req, res, next) => {
  try {
    const { body } = req;
    const { refreshToken } = body;
    console.log(refreshToken);
    // verificar si el token existe
    if (!refreshToken) return res.status(401).json({ message: "No hay token" });
    // verificar si el token existe en la base de datos
    const foundRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    });
    if (!foundRefreshToken) {
      res.status(403).json({ message: "El token no esta en la base de datos" });
      return;
    }
    console.log(foundRefreshToken);
    // verificar si el token ha expirado
    if (validateRefreshToken(foundRefreshToken)) {
      RefreshToken.findByIdAndDelete(foundRefreshToken._id, {
        useFindAndModify: false,
      }).exec();
      res.status(403).json({ message: "El token ha expirado" });
      return;
    }
    // generar nuevo token
    const user = { userId: foundRefreshToken.userId };
    const newAccessToken = jwt.sign(user, config.secretKey, {
      expiresIn: config.jwtExpirationTime,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: foundRefreshToken.token,
    });
  } catch (error) {
    next(error);
  }
};

const whoAmI = async (req, res, next) => {
  try {
    const { userId } = req; // user authenticated
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, userLogin, token, whoAmI };
