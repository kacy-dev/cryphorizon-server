// routes/chatConfigRoutes.js
const express = require("express");
const router = express.Router();
const { getChatConfig, setChatConfig } = require("../controllers/chatConfigController");

router.get("/chat-config", getChatConfig);
router.post("/chat-config", setChatConfig);

module.exports = router;
