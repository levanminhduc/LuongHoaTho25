const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { testConnection } = require("./config/database");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const swaggerSetup = require("./utils/swagger");

const authRoutes = require("./routes/auth.routes");
const payrollRoutes = require("./routes/payroll.routes");
const employeeRoutes = require("./routes/employee");
const importRoutes = require("./routes/importRoutes");
const sseRoutes = require("./routes/sse.routes");

const app = express();
const PORT = process.env.PORT || 4001;

const uploadsDir = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || "http://localhost:5173"
        : true, // Allow all origins in development
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200, // limit each IP to 200 requests per windowMs
  message: {
    error: "Too many requests",
    message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/import", importRoutes);
app.use("/api/sse", sseRoutes);

// Swagger documentation
swaggerSetup(app);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Payroll Management API",
    version: "1.0.0",
    documentation: "/api/docs",
    health: "/api/health",
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    console.log("🔍 Kiểm tra kết nối database...");
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error(
        "❌ Không thể kết nối database. Server sẽ không khởi động."
      );
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Lỗi khởi động server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Promise Rejection:", err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

startServer();

module.exports = app;
