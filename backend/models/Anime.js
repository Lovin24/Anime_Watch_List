const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    animeId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["watching", "completed", "plan to watch", "dropped"],
      default: "plan to watch",
    },
    score: {
      type: Number,
      min: 0,
      max: 10,
    },
  },
  { timestamps: true }
);

const Anime = mongoose.model("Anime", animeSchema);
module.exports = Anime;
