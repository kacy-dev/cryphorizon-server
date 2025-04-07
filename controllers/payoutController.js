const { handleDailyPayout } = require("../services/payoutService");

const triggerPayout = async (req, res) => {
  try {
    await handleDailyPayout();
    res.status(200).json({ message: "Payout executed successfully" });
  } catch (err) {
    console.error("Payout error", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};


module.exports = { triggerPayout };