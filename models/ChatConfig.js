// models/ChatConfig.js
const mongoose = require("mongoose");

const chatConfigSchema = new mongoose.Schema({
  chatApiUrl: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("ChatConfig", chatConfigSchema);
