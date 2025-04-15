// controllers/chatConfigController.js
const ChatConfig = require("../models/ChatConfig");

const setChatConfig = async (req, res) => {
  const { chatApiUrl } = req.body;
  try {
    const config = await ChatConfig.findOneAndUpdate(
      {},
      { chatApiUrl },
      { upsert: true, new: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Failed to set chat config" });
  }
};

const getChatConfig = async (req, res) => {
  try {
    const config = await ChatConfig.findOne();
    if (!config) return res.status(404).json({ error: "No config found" });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat config" });
  }
};

module.exports = {
  setChatConfig,
  getChatConfig
};
