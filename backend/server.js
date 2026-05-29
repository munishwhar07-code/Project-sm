const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const { protect, authorize } = require('./middleware/authMiddleware');

// Routes
const pgRoutes = require("./routes/Pgroutes");
const bookingRoutes = require("./routes/Bookingroutes");
const requirementRoutes = require("./routes/Requirementroutes");
const authRoutes = require("./routes/auth");
// Load env variables
dotenv.config();

// Initialize app
const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors(
  origin => [
    'http://localhost:5173', // Vite dev server
    'https://nestmate-frontend-lgwz.onrender.com', // Deployed frontend
  ]
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NestMate API running successfully",
  });
});

// API Routes
app.use("/api/pgs", pgRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/auth", authRoutes);
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Middleware
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});