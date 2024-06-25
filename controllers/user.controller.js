const bcrypt = require("bcrypt");
// models
const User = require("./../models/user.model");

const findAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).populate("roles");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const findOneUser = async (req, res, next) => {
  try {
    const { params } = req;
    const { id } = params;
    const user = await User.findById(id).populate("roles");
    if (!user) {
      res
        .status(404)
        .json({ message: `El usuario con id ${id} no se encuentra` });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { params, body } = req;
    const { id } = params;
    const { email, password, ...rest } = body;
    // buscar el usuario
    const user = await User.findById(id);
    if (!user) {
      res
        .status(404)
        .json({ message: `El usuario con id ${id} no se encuentra` });
      return;
    }
    // validar que el email no exista
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400).json({ message: `El correo ${email} ya existe` });
      return;
    }
    // encriptar la contraseña
    const hash = await bcrypt.hash(password, 10);
    // actualizar el usuario
    const userUpdated = await User.findByIdAndUpdate(
      id,
      { email, password: hash, ...rest },
      { new: true }
    );
    res.status(200).json(userUpdated);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { params } = req;
    const { id } = params;
    const user = await User.findById(id);
    if (!user) {
      res
        .status(404)
        .json({ message: `El usuario con id ${id} no se encuentra` });
    }
    await User.deleteOne({ _id: id });
    res.status(204).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    next(error);
  }
};

module.exports = { findAllUsers, findOneUser, updateUser, deleteUser };
