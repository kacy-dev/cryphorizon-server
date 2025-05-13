/*const User = require("../models/userModel");
const ActiveInvestment = require("../models/activeInvestmentPlan");
const CronLock = require("../models/cronLock");

// Configurable time window
const WINDOW_START_HOUR = 0; // 12:00 AM
const WINDOW_END_HOUR = 5;   // 5:00 AM
let isProcessing = false;

const handleDailyPayout = async () => {
  const now = new Date();
  const today = now.toDateString();
  console.log(`[INFO] Cron triggered at: ${now.toISOString()}`);

  try {
    const lock = await CronLock.findOne({ job: "dailyPayout" });

    // Check if already processed today
    if (lock && new Date(lock.lastRun).toDateString() === today) {
      console.log("Payout already processed for today");
      return;
    }

    const hour = now.getHours();
    if (lock && (hour < WINDOW_START_HOUR || hour >= WINDOW_END_HOUR)) {
      console.log("Missed window (12am-5am). Starting interval-based checks.");
      startIntervalChecks(lock, today);
      return;
    }

    console.log("Payout processed successfully.");
    await processPayouts(lock, today);
  } catch (error) {
    console.error("[ERROR] Failed to handle daily payout:", error);
  }
};

const startIntervalChecks = (lock, today) => {
  const interval = setInterval(async () => {
    if (isProcessing) return;

    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    // Stop checking if it's past 5:05 AM
    if (currentHour >= WINDOW_END_HOUR + 0.08) {
      clearInterval(interval);
      console.log("Exiting interval-based checks due to time window expiration.");
      return;
    }

    try {
      console.log(`Checking missed payouts at ${now.toTimeString()}`);
      const isPayoutProcessed = await checkIfPayoutProcessedToday(today);

      if (!isPayoutProcessed) {
        isProcessing = true;
        await processPayouts(lock, today);
        clearInterval(interval);
        console.log("[INFO] Missed payout processed successfully.");
        isProcessing = false;
      }
    } catch (error) {
      console.error("[ERROR] Error during interval-based payout check:", error);
    }
  }, 10 * 60 * 1000); // Every 10 minutes
};

const checkIfPayoutProcessedToday = async (today) => {
  const lock = await CronLock.findOne({ job: "dailyPayout" });
  return lock && new Date(lock.lastRun).toDateString() === today;
};


const processPayouts = async (lock, today) => {
  const now = new Date();
  const BATCH_SIZE = 100; // Number of investments to process in each batch
  const MAX_RETRIES = 3;  // Max number of retry attempts in case of failure

  try {
    let skip = 0;
    let retryCount = 0;
    let hasError = false;

    // Process investments in batches
    while (true) {
      const activeInvestments = await ActiveInvestment.find({ isCompleted: false })
        .populate("user")
        .populate("plan")
        .skip(skip)
        .limit(BATCH_SIZE);

      console.log(`[INFO] Processing batch starting from ${skip}. Found ${activeInvestments.length} active investments.`);

      if (activeInvestments.length === 0) break; // No more investments to process

      for (const investment of activeInvestments) {
        try {
          const lastCalc = new Date(investment.last_calculated);
          const todayDate = now.toDateString();

          if (lastCalc.toDateString() === todayDate) continue; // Already processed today, skip

          let diffInDays = Math.floor((now - lastCalc) / (1000 * 60 * 60 * 24));
          if (diffInDays < 1) continue;

          const MAX_DAYS = 5;
          if (diffInDays > MAX_DAYS) {
            console.warn(`[WARN] Capping ROI payout for user ${investment.user?.username} to ${MAX_DAYS} days (was ${diffInDays}).`);
            diffInDays = MAX_DAYS;
          }

          const user = investment.user;
          if (!user) {
            console.warn(`[WARN] Skipping investment ${investment._id} — user not found.`);
            continue;
          }

          const totalROI = investment.daily_roi * diffInDays;
          user.balance += totalROI;
          user.total_earnings += totalROI;

          investment.last_calculated = now;

          console.log(
            `[INFO] Adding ${totalROI} ROI to user ${user.username} for ${diffInDays} day(s). Total earnings now: ${user.total_earnings}`
          );

          await user.save();
          await investment.save();

          console.log(`User's balance updated: ${user.username}, New Balance: ${user.balance}`);

        } catch (error) {
          console.error(`[ERROR] Failed to process investment ${investment._id}:`, error);

          // Retry logic for the investment if it fails
          if (retryCount < MAX_RETRIES) {
            console.log(`[INFO] Retrying investment ${investment._id}, attempt ${retryCount + 1}`);
            retryCount++;
            hasError = true;  // Set a flag to retry the batch
            break;  // Break to retry the entire batch
          } else {
            console.error(`[ERROR] Max retries reached for investment ${investment._id}. Skipping.`);
          }
        }
      }

      if (!hasError) {
        skip += BATCH_SIZE; // Only move to next batch if there were no errors
      } else {
        // If there's an error, reset the retry count and try the same batch again
        retryCount = 0;
        hasError = false;
        console.log("[INFO] Retrying the batch due to errors.");
      }
    }

    // Update cron lock
    await CronLock.findOneAndUpdate(
      { job: "dailyPayout" },
      { lastRun: now },
      { upsert: true }
    );

    console.log("Payout processed successfully.");

  } catch (error) {
    console.error("[ERROR] Failed to process payouts:", error);
  }
};



module.exports = { handleDailyPayout };*/


const User = require("../models/userModel");
const ActiveInvestment = require("../models/activeInvestmentPlan");
const CronLock = require("../models/cronLock");

// Configurable time window
const WINDOW_START_HOUR = 0; // 12:00 AM
const WINDOW_END_HOUR = 5;   // 5:00 AM
let isProcessing = false;

const handleDailyPayout = async () => {
  const now = new Date();
  const today = now.toDateString();
  console.log(`[INFO] Cron triggered at: ${now.toISOString()}`);

  try {
    const lock = await CronLock.findOne({ job: "dailyPayout" });

    if (lock && new Date(lock.lastRun).toDateString() === today) {
      console.log("Payout already processed for today");
      return;
    }

    const hour = now.getHours();
    if (lock && (hour < WINDOW_START_HOUR || hour >= WINDOW_END_HOUR)) {
      console.log("Missed window (12am-5am). Starting interval-based checks.");
      startIntervalChecks(lock, today);
      return;
    }

    console.log("Payout processed successfully.");
    await processPayouts(lock, today);
  } catch (error) {
    console.error("[ERROR] Failed to handle daily payout:", error);
  }
};

const startIntervalChecks = (lock, today) => {
  const interval = setInterval(async () => {
    if (isProcessing) return;

    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    if (currentHour >= WINDOW_END_HOUR + 0.08) {
      clearInterval(interval);
      console.log("Exiting interval-based checks due to time window expiration.");
      return;
    }

    try {
      console.log(`Checking missed payouts at ${now.toTimeString()}`);
      const isPayoutProcessed = await checkIfPayoutProcessedToday(today);

      if (!isPayoutProcessed) {
        isProcessing = true;
        await processPayouts(lock, today);
        clearInterval(interval);
        console.log("[INFO] Missed payout processed successfully.");
        isProcessing = false;
      }
    } catch (error) {
      console.error("[ERROR] Error during interval-based payout check:", error);
    }
  }, 10 * 60 * 1000); // Every 10 minutes
};

const checkIfPayoutProcessedToday = async (today) => {
  const lock = await CronLock.findOne({ job: "dailyPayout" });
  return lock && new Date(lock.lastRun).toDateString() === today;
};

const processPayouts = async (lock, today) => {
  const now = new Date();
  const BATCH_SIZE = 100;
  const MAX_RETRIES = 3;

  try {
    let skip = 0;
    let retryCount = 0;
    let hasError = false;

    while (true) {
      const activeInvestments = await ActiveInvestment.find({ isCompleted: false })
        .populate("user")
        .populate("plan")
        .skip(skip)
        .limit(BATCH_SIZE);

      console.log(`[INFO] Processing batch starting from ${skip}. Found ${activeInvestments.length} active investments.`);

      if (activeInvestments.length === 0) break;

      for (const investment of activeInvestments) {
        try {
          const lastCalc = new Date(investment.last_calculated);
          if (lastCalc.toDateString() === now.toDateString()) continue;

          let diffInDays = Math.floor((now - lastCalc) / (1000 * 60 * 60 * 24));
          if (diffInDays < 1) continue;

          const MAX_DAYS = 5;
          if (diffInDays > MAX_DAYS) {
            console.warn(`[WARN] Capping ROI payout for user ${investment.user?.username} to ${MAX_DAYS} days (was ${diffInDays}).`);
            diffInDays = MAX_DAYS;
          }

          const user = investment.user;
          const plan = investment.plan;
          if (!user || !plan) {
            console.warn(`[WARN] Skipping investment ${investment._id} — user or plan not found.`);
            continue;
          }

          const totalROI = investment.daily_roi * diffInDays;
          investment.totalPaid += totalROI;
          user.balance += totalROI;
          user.total_earnings += totalROI;

          investment.last_calculated = now;

          const expectedReturn = investment.amount * (plan.return_percentage || 1); // Default to 1x if missing
          if (investment.totalPaid >= expectedReturn) {
            investment.isCompleted = true;
            console.log(`[INFO] Investment ${investment._id} completed for user ${user.username}`);
          }

          console.log(
            `[INFO] Adding ${totalROI} ROI to user ${user.username} for ${diffInDays} day(s). Total earnings now: ${user.total_earnings}`
          );

          await user.save();
          await investment.save();

          console.log(`User's balance updated: ${user.username}, New Balance: ${user.balance}`);
        } catch (error) {
          console.error(`[ERROR] Failed to process investment ${investment._id}:`, error);

          if (retryCount < MAX_RETRIES) {
            console.log(`[INFO] Retrying investment ${investment._id}, attempt ${retryCount + 1}`);
            retryCount++;
            hasError = true;
            break;
          } else {
            console.error(`[ERROR] Max retries reached for investment ${investment._id}. Skipping.`);
          }
        }
      }

      if (!hasError) {
        skip += BATCH_SIZE;
      } else {
        retryCount = 0;
        hasError = false;
        console.log("[INFO] Retrying the batch due to errors.");
      }
    }

    await CronLock.findOneAndUpdate(
      { job: "dailyPayout" },
      { lastRun: now },
      { upsert: true }
    );

    console.log("Payout processed successfully.");
  } catch (error) {
    console.error("[ERROR] Failed to process payouts:", error);
  }
};

module.exports = { handleDailyPayout };






