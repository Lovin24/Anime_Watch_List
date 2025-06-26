const Comment = require("../models/Comment");

// Get all comments for an anime
const getComments = async (req, res) => {
  try {
    const animeId = req.params.id;
    const comments = await Comment.find({ animeId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// Add a comment for an anime
const addComment = async (req, res) => {
  try {
    const animeId = req.params.id;
    const { content } = req.body;
    const userId = req.user._id;
    const username = req.user.username;
    const comment = await Comment.create({
      animeId,
      user: userId,
      username,
      content,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

module.exports = { getComments, addComment };
