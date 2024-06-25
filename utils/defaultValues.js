const { config } = require("./../config/config");
const bcrypt = require("bcrypt");
//models
const User = require("../models/user.model");
const Role = require("../models/role.model");

async function createDefaultRoles() {
  try {
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

async function createAdminUser() {
  try {
    const data = {
      firstName: config.adminFirstName,
      lastName: config.adminLastName,
      email: config.adminEmail,
      password: config.adminPassword,
    };
    const { email, password, ...rest } = data;
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      const foundRole = await Role.findOne({ name: "admin" });
      if (!foundRole) {
        console.error("El rol admin no existe");
        return;
      }
      const hash = await bcrypt.hash(password, 10);
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
