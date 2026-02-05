const express = require("express");
const router = express.Router();
const { getShowtimes, getShowtimesByMovie, getShowtimeById, createShowtime, deleteShowtime } = require("../controllers/showtimeController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, admin, createShowtime).get(getShowtimes);
router.route("/:movieId").get(getShowtimesByMovie);
router.route("/single/:id").get(getShowtimeById);
router.route("/:id").delete(protect, admin, deleteShowtime);

module.exports = router;
