const Showtime = require("../models/Showtime");
const Movie = require("../models/Movie");

// Helper to generate seats
const generateSeats = (rows = 8, cols = 10) => {
  const seats = [];
  const rowLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      seats.push({
        row: rowLabels[r],
        number: c,
        isBooked: false,
      });
    }
  }
  return seats;
};

// @desc    Get showtimes for a movie
// @route   GET /api/showtimes/:movieId
// @access  Public
const getShowtimesByMovie = async (req, res) => {
  try {
    const showtimes = await Showtime.find({ movie: req.params.movieId }).populate("movie");
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single showtime (with seats)
// @route   GET /api/showtimes/single/:id
// @access  Public
const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate("movie");
    if (showtime) {
      res.json(showtime);
    } else {
      res.status(404).json({ message: "Showtime not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a showtime
// @route   POST /api/showtimes
// @access  Private/Admin
const createShowtime = async (req, res) => {
  const { movieId, startTime, price, screen } = req.body;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const showtime = new Showtime({
      movie: movieId,
      startTime,
      price,
      screen,
      seats: generateSeats(),
    });

    const createdShowtime = await showtime.save();
    res.status(201).json(createdShowtime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all showtimes
// @route   GET /api/showtimes
// @access  Public
const getShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find({}).populate("movie");
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a showtime
// @route   DELETE /api/showtimes/:id
// @access  Private/Admin
const deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (showtime) {
      await showtime.deleteOne();
      res.json({ message: "Showtime removed" });
    } else {
      res.status(404).json({ message: "Showtime not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getShowtimes, getShowtimesByMovie, getShowtimeById, createShowtime, deleteShowtime };
