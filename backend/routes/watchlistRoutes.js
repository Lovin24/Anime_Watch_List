const express = require("express");
const {
  getUserWatchlist,
  addToWatchlist,
  updateWatchlistEntry,
  deleteFromWatchlist,
  getRecommendations,
} = require("../controllers/watchlistController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getUserWatchlist);
router.get("/recommendations", protect, getRecommendations);
router.post("/", protect, addToWatchlist);
router.put("/:id", protect, updateWatchlistEntry);
router.delete("/:id", protect, deleteFromWatchlist);

module.exports = router;
