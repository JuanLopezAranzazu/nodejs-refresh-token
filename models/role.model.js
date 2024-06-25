const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    unique: true,
  },
});

const Role = mongoose.model("role", roleSchema);

module.exports = Role;
