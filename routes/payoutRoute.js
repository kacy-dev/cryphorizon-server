const express = require("express");
const router = express.Router();
const { triggerPayout } = require("../controllers/payoutController");

router.get("/daily-payout", triggerPayout);

module.exports = router;

