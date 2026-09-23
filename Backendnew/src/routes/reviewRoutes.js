const express = require("express");
const router = express.Router();
const { addReview, getMovieReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/reviews - Add a review (Protected)
router.post("/", protect, addReview);

// GET /api/reviews/:movieId - Get reviews for a movie
router.get("/:movieId", getMovieReviews);

module.exports = router;
