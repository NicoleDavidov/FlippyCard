const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const cardRoutes = require("./routes/card.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cards", cardRoutes);

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// middleware
app.use(errorHandler)

module.exports = app;
