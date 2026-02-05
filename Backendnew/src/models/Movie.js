const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  poster: {
    type: String, // URL to image
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
