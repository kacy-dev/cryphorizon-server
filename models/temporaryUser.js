const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  profile_img: String,
  otp: String,
  otpExpiresAt: Date,
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TempUser", tempUserSchema);
