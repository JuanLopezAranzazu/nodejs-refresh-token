const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  lastName: {
    type: String,
    required: [true, "El apellido es requerido"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es requerido"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
  },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "role",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.password;
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
