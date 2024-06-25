const { config } = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// models
const User = require("../models/user.model");
const Role = require("../models/role.model");
// almacenar los tokens
let refreshTokens = [];

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
    const user = { userId: foundUser._id, roles };

    const accessToken = jwt.sign(user, config.secretKey, {
      expiresIn: config.jwtExpirationTime,
    });

    const refreshToken = jwt.sign(user, config.refreshSecretKey, {
      expiresIn: config.jwtRefreshExpirationTime,
    });

    // almacenar el token
    refreshTokens.push(refreshToken);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const token = (req, res, next) => {
  try {
    const { body } = req;
    const { refreshToken } = body;
    console.log(refreshToken);
    // verificar si el token existe
    if (!refreshToken)
      return res.status(401).json({ message: "No hay token"});
    if (!refreshTokens.includes(refreshToken))
      return res.status(403).json({ message: "Acceso denegado" });
    console.log(refreshTokens);
    // verificar si el token es valido
    jwt.verify(refreshToken, config.refreshSecretKey, (err, user) => {
      if (err) return res.status(403).json({ message: "Acceso denegado" });

      const accessToken = jwt.sign(
        { userId: user.userId, roles: user.roles },
        config.secretKey,
        {
          expiresIn: config.jwtExpirationTime,
        }
      );

      res.status(200).json({ accessToken });
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
