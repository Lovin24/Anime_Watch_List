const express = require("express");
const router = express.Router();

const controller = require("../controllers/commentController");
console.log(controller); // 👈 Add this

const { getComments, addComment } = controller;
const protect = require("../middleware/authMiddleware");

// Get all comments for an anime
router.get("/:animeId", getComments);
// Add a comment for an anime
router.post("/:animeId", protect, addComment);
// Delete a comment
router.delete("/:commentId", protect, controller.deleteComment);
// Upvote a comment
router.post("/upvote/:commentId", protect, controller.upvoteComment);
// Remove upvote
router.post("/unupvote/:commentId", protect, controller.unupvoteComment);

module.exports = router;
