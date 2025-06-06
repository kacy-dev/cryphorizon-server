require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const session = require("express-session");
const { json, urlencoded } = require("body-parser");
const mongoDBConnection = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoute");
const paymentGateway = require("./routes/paymentGatewayRoutes");
const withdrawals = require("./routes/withdraw/withdrawRoutes");
const emailRoutes = require("./routes/email/sendEmailGenerally");
// require("./cron/cronScheduler");
const setupDailyCron = require("./cron/cronScheduler");
const payoutRoutes = require("./routes/payoutRoute");
const contactRoute = require('./routes/contactRoute');
const chatScriptRoutes = require("./routes/chatScriptRoutes");



const app = express();

// Middleware
const allowedOrigins = process.env.CORS_SERVER.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(json());
app.use(urlencoded({ extended: true }));

// Session middleware should be before routes
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Connect to MondoDB
mongoDBConnection();
setupDailyCron();


// Routes
app.use("/api/payout", payoutRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", planRoutes);
app.use("/api", paymentGateway);
app.use("/api", withdrawals);
app.use("/api/emails", emailRoutes);
app.use("/api", contactRoute);
app.use("/api", chatScriptRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully.",
  });
});
app.get("/checkSession", (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).json({ message: "No user logged in" });
  }
  return res
    .status(200)
    .json({ message: "User is logged in", user_id: req.session.user_id });
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server connected successfully on http://localhost:${PORT}`);
});
