// server.js (Updated with auth & watchlist routes)
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const commentRoutes = require("./routes/commentRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => {
  res.send("Anime Watchlist API Running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
