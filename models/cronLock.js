const mongoose = require("mongoose");

const cronLockSchema = new mongoose.Schema({
  job: { type: String, required: true, unique: true },
  lastRun: { type: Date, default: null },
});

module.exports = mongoose.model("CronLock", cronLockSchema);
