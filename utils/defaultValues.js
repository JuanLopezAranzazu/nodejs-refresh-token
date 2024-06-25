const { config } = require("./../config/config");
const bcrypt = require("bcrypt");
//models
const User = require("../models/user.model");
const Role = require("../models/role.model");

// Crear roles por defecto
async function createDefaultRoles() {
  try {
    // Verificar si existen roles
    const count = await Role.countDocuments();
    if (count === 0) {
      await Role.create({ name: "admin" });
      await Role.create({ name: "user" });
      console.log("Roles creados exitosamente");
    }
  } catch (err) {
    console.error("Error creando roles", err);
  }
}

// Crear usuario admin
async function createAdminUser() {
  try {
    const data = {
      firstName: config.adminFirstName,
      lastName: config.adminLastName,
      email: config.adminEmail,
      password: config.adminPassword,
    };
    const { email, password, ...rest } = data;
    // Verificar si el usuario ya existe
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      // Verificar si el rol admin existe
      const foundRole = await Role.findOne({ name: "admin" });
      if (!foundRole) {
        console.error("El rol admin no existe");
        return;
      }
      // Encriptar la contraseña
      const hash = await bcrypt.hash(password, 10);
      // Crear el usuario
      const newUser = new User({
        email,
        password: hash,
        roles: [foundRole._id],
        ...rest,
      });
      await newUser.save();
      console.log("Usuario admin creado exitosamente");
    }
  } catch (err) {
    console.error("Error creando usuario admin", err);
  }
}

module.exports = { createDefaultRoles, createAdminUser };
