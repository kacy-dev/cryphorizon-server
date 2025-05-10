const mongoose = require('mongoose');

const chatScriptSchema = new mongoose.Schema({
  provider: {
    type: String,
    enum: ['smartsupp', 'tawkto'],
    required: true
  },
  key: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ChatScript', chatScriptSchema);
