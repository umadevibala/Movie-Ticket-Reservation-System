const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  screen: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seats: [
    {
      row: String,
      number: Number,
      isBooked: {
        type: Boolean,
        default: false,
      },
      bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Showtime", showtimeSchema);
