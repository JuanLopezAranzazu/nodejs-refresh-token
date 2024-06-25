const { v4: uuidv4 } = require("uuid");
// models
const RefreshToken = require("../models/refreshToken.model");

// Guardar refreshToken en la base de datos
const saveRefreshToken = async (userId) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // Expira en 7 días

  // Crear refreshToken
  const newRefreshToken = new RefreshToken({
    token: uuidv4(), // generar token con uuid
    user: userId,
    expiryDate: expiryDate.getTime(),
  });

  const refreshToken = await newRefreshToken.save();

  return refreshToken;
};

// Validar refreshToken
const validateRefreshToken = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

module.exports = { saveRefreshToken, validateRefreshToken };
