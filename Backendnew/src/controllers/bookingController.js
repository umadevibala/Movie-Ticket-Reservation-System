const Booking = require("../models/Booking");
const Showtime = require("../models/Showtime");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { showtimeId, seats } = req.body; // seats: [{row, number}]

  try {
    const showtime = await Showtime.findById(showtimeId);

    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    // Check if seats are already booked

    for (const seatReq of seats) {
      const seatIndex = showtime.seats.findIndex(
        (s) => s.row === seatReq.row && s.number === seatReq.number
      );

      if (seatIndex === -1) {
        return res.status(400).json({ message: `Seat ${seatReq.row}${seatReq.number} does not exist` });
      }

      if (showtime.seats[seatIndex].isBooked) {
        return res.status(400).json({ message: `Seat ${seatReq.row}${seatReq.number} is already booked` });
      }

      // Mark as booked
      showtime.seats[seatIndex].isBooked = true;
      showtime.seats[seatIndex].bookedBy = req.user._id;
    }

    // await showtime.save();
    // Use updateOne to bypass validation of other fields like 'screen'
    await Showtime.updateOne(
      { _id: showtime._id },
      { $set: { seats: showtime.seats } }
    );

    const booking = new Booking({
      user: req.user._id,
      showtime: showtimeId,
      seats: seats,
      totalPrice: seats.length * showtime.price,
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "showtime",
        populate: {
          path: "movie",
          model: "Movie"
        }
      });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    console.log(`[CancelBooking] Request for ID: ${bookingId}`);

    // Validate ID format
    if (!bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("[CancelBooking] Invalid ID format");
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const booking = await Booking.findById(bookingId);
    console.log(`[CancelBooking] Booking found: ${!!booking}`);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure user owns the booking or is admin
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    console.log(`[CancelBooking] Auth check - Owner: ${isOwner}, Admin: ${isAdmin}`);

    if (!isOwner && !isAdmin) {
      return res.status(401).json({ message: "Not authorized to cancel this booking" });
    }

    const showtime = await Showtime.findById(booking.showtime);
    console.log(`[CancelBooking] Showtime found: ${!!showtime}`);

    if (showtime) {
      // Release seats
      const bookedSeats = booking.seats || [];
      console.log(`[CancelBooking] Releasing ${bookedSeats.length} seats`);

      bookedSeats.forEach(bookedSeat => {
        if (!showtime.seats) return;

        const seatIndex = showtime.seats.findIndex(
          s => s.row === bookedSeat.row && s.number === bookedSeat.number
        );
        if (seatIndex !== -1) {
          showtime.seats[seatIndex].isBooked = false;
          showtime.seats[seatIndex].bookedBy = null;
        }
      });

      console.log("[CancelBooking] Saving showtime (via updateOne)...");
      // Use updateOne to bypass validation of other fields like 'screen'
      await Showtime.updateOne(
        { _id: showtime._id },
        { $set: { seats: showtime.seats } }
      );
      console.log("[CancelBooking] Showtime saved");
    }

    console.log("[CancelBooking] Deleting booking...");
    await booking.deleteOne();
    console.log("[CancelBooking] Booking deleted");

    res.json({ message: "Booking cancelled and seats released" });

  } catch (error) {
    console.error("Cancel Booking Error Stack:", error.stack);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking };
