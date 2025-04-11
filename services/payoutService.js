// const User = require("../models/userModel");
// const ActiveInvestment = require("../models/activeInvestmentPlan");
// const InvestmentPlan = require("../models/investmentPlanModel");
// const CronLock = require("../models/cronLock");

// const handleDailyPayout = async () => {
//   const now = new Date();
//   const today = now.toDateString();

//   const lock = await CronLock.findOne({ job: "dailyPayout" });

//   // Check if already processed today
//   if (lock && new Date(lock.lastRun).toDateString() === today) {
//     console.log("⏩ Payout already processed for today");
//     return;
//   }

//   // If we're between midnight and 5am, it's still valid to run fallback
//   const hour = now.getHours();
//   if (lock && hour > 5) {
//     console.log("⏸️ Missed window (12am-5am). Skipping fallback.");
//     return;
//   }

//   // Get active investments
//   const activeInvestments = await ActiveInvestment.find({ isCompleted: false })
//     .populate("user")
//     .populate("plan");

//   for (const investment of activeInvestments) {
//     const lastCalc = new Date(investment.last_calculated);
//     const diffInDays = Math.floor((now - lastCalc) / (1000 * 60 * 60 * 24));

//     if (diffInDays < 1) continue;

//     const user = investment.user;
//     const roi = investment.daily_roi;

//     // Add ROI per day missed (1-day granularity)
//     const totalROI = roi * diffInDays;
//     user.balance += totalROI;
//     user.total_earnings += totalROI;

//     investment.last_calculated = now;

//     await user.save();
//     await investment.save();
//   }

//   await CronLock.findOneAndUpdate(
//     { job: "dailyPayout" },
//     { lastRun: now },
//     { upsert: true }
//   );

//   console.log("✅ Payout processed successfully.");
// };

// module.exports = {
//     handleDailyPayout
// };
const User = require("../models/userModel");
const ActiveInvestment = require("../models/activeInvestmentPlan");
const CronLock = require("../models/cronLock");

const handleDailyPayout = async () => {
  const now = new Date();
  const today = now.toDateString();
  console.log(`[INFO] Cron triggered at: ${now.toISOString()}`);

  // Check if the payout has already been processed today
  const lock = await CronLock.findOne({ job: "dailyPayout" });

  if (lock && new Date(lock.lastRun).toDateString() === today) {
    console.log("Payout already processed for today");
    return;
  }

  const hour = now.getHours();
  if (lock && hour >= 5) {
    console.log("Missed window (12am-5am). Starting interval-based checks.");
    startIntervalChecks(lock, today);
    return;
  }

  console.log("Payout processed successfully.");
  await processPayouts(lock, today);
};

const startIntervalChecks = (lock, today) => {
  const interval = setInterval(async () => {
    const now = new Date();
    const currentHour = now.getHours();

    // Check if the time is between 12 AM and 5 AM
    if (currentHour >= 5) {
      clearInterval(interval);
      console.log("Exiting interval-based checks.");
      return;
    }

    console.log(`Checking missed payouts at ${now.toTimeString()}`);

    const isPayoutProcessed = await checkIfPayoutProcessedToday(today);

    if (!isPayoutProcessed) {
      await processPayouts(lock, today);
      clearInterval(interval); // Stop checking once the update is successful
      console.log("[INFO] Cron job executed...");
      console.log(" Missed payout processed successfully.");
    }
  }, 2 * 60 * 1000); // Check every 30 minutes
};

const checkIfPayoutProcessedToday = async (today) => {
  const lock = await CronLock.findOne({ job: "dailyPayout" });
  return lock && new Date(lock.lastRun).toDateString() === today;
};

const processPayouts = async (lock, today) => {
  const now = new Date();

  // Get active investments that are still not completed
  const activeInvestments = await ActiveInvestment.find({ isCompleted: false })
    .populate("user")
    .populate("plan");

    console.log(`[INFO] Found ${activeInvestments.length} active investments.`);

  for (const investment of activeInvestments) {
    const lastCalc = new Date(investment.last_calculated);
    const diffInDays = Math.floor((now - lastCalc) / (1000 * 60));
    // const diffInDays = Math.floor((now - lastCalc) / (1000 * 60 * 60 * 24));

    if (diffInDays < 3) continue; // Skip if no days have passed

    const user = investment.user;
    if (!user) {
      console.warn(`[WARN] Skipping investment ${investment._id} — user not found.`);
      continue;
    }
    
    const roi = investment.daily_roi;

    // Add ROI per day missed (1-day granularity)
    const totalROI = roi * diffInDays;
    user.balance += totalROI;
    user.total_earnings += totalROI;

    investment.last_calculated = now;

    console.log(
        `[INFO] Adding ${totalROI} ROI to user ${user.username}, Total earnings now: ${user.total_earnings}`
      );
  

    await user.save();
    await investment.save();

    console.log(`User's balance updated: ${user.username}, New Balance: ${user.balance}`);
  }

  // Update the cron lock to prevent reprocessing the same day
  await CronLock.findOneAndUpdate(
    { job: "dailyPayout" },
    { lastRun: now },
    { upsert: true }
  );

  console.log("Payout processed successfully.");
};

module.exports = {
  handleDailyPayout
};




