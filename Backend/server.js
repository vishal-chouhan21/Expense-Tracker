import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongoDB.js";
import userRouter from "./routes/userRouter.js";
import expenseRouter from "./routes/expenseRouter.js";
import incomeRouter from "./routes/incomeRouter.js";
import profileRouter from "./routes/profileRouter.js";
import otpRouter from "./routes/otpRouter.js";
import forgotRouter from "./routes/forgotRouter.js";
import khataRouter from "./routes/khataRouter.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
await connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Routes
app.use("/api/user", userRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/income", incomeRouter);
app.use("/api/profile", profileRouter);
app.use("/api/otp", otpRouter);
app.use("/api/forgotPassword", forgotRouter);
app.use("/api/khata", khataRouter);

// API endpoint
app.get("/", (req, res) =>
  res.status(200).json({ success: true, message: "API is working" })
);

// 404 handler (no route matched)
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err?.status || 500)
    .json({
      success: false,
      message: err?.message || "Internal server error",
    });
});

// Start server
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
