const Comment = require("../models/Comment");

// Get all comments for an anime
const getComments = async (req, res) => {
  try {
    const animeId = req.params.animeId;
    const comments = await Comment.find({ animeId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// Add a comment for an anime (supports replies)
const addComment = async (req, res) => {
  try {
    const animeId = req.params.animeId;
    const { content, parentComment } = req.body;
    const userId = req.user._id;
    const username = req.user.username;
    const comment = await Comment.create({
      animeId,
      user: userId,
      username,
      content,
      parentComment: parentComment || null,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

// Upvote a comment
const upvoteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.upvotedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "Already upvoted" });
    }
    comment.upvotes += 1;
    comment.upvotedBy.push(req.user._id);
    await comment.save();
    res.status(200).json({ upvotes: comment.upvotes });
  } catch (error) {
    res.status(500).json({ message: "Failed to upvote comment" });
  }
};

// Remove upvote
const unupvoteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    const idx = comment.upvotedBy.indexOf(req.user._id);
    if (idx === -1) {
      return res.status(400).json({ message: "Not upvoted yet" });
    }
    comment.upvotes -= 1;
    comment.upvotedBy.splice(idx, 1);
    await comment.save();
    res.status(200).json({ upvotes: comment.upvotes });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove upvote" });
  }
};

module.exports = {
  getComments,
  addComment,
  deleteComment,
  upvoteComment,
  unupvoteComment,
};
