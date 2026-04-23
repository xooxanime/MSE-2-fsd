require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const grievanceRoutes = require("./routes/grievance");

const app = express();

// DB connect
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", authRoutes);
app.use("/api", grievanceRoutes);

// Server start
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);