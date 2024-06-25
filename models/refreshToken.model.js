const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
  token: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  expiryDate: Date,
});

const RefreshToken = mongoose.model("refreshToken", refreshTokenSchema);

module.exports = RefreshToken;
