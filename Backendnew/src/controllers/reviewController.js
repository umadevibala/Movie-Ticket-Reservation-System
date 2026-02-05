const Review = require("../models/Review");
const Movie = require("../models/Movie");

// Add a review
exports.addReview = async (req, res) => {
    try {
        const { movieId, rating, comment } = req.body;

        // Check if user already reviewed this movie??? (Optional constraint)

        const review = new Review({
            user: req.user.id,
            movie: movieId,
            rating,
            comment
        });

        await review.save();

        // Update movie average rating (simple implementation)
        // In a real app, you might want to aggregate this periodically or use a more efficient update method
        const reviews = await Review.find({ movie: movieId });
        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

        await Movie.findByIdAndUpdate(movieId, { rating: avgRating });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get reviews for a movie
exports.getMovieReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ movie: req.params.movieId })
            .populate("user", "name") // Assuming User model has a name field
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
