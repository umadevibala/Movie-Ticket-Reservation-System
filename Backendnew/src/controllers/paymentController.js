const Booking = require("../models/Booking");

// Simulate Payment Process
exports.processPayment = async (req, res) => {
    try {
        const { bookingId, amount, paymentMethod } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.paymentStatus === "completed") {
            return res.status(400).json({ message: "Booking already paid" });
        }

        // SIMULATION LOGIC
        // In a real app, you would verify the payment with Stripe/Razorpay here
        const isSuccess = true; // Force success for demo
        const mockTransactionId = "txn_" + Math.random().toString(36).substr(2, 9);

        if (isSuccess) {
            booking.paymentStatus = "completed";
            booking.status = "confirmed"; // Confirm the booking
            booking.paymentId = mockTransactionId;
            await booking.save();

            return res.json({
                success: true,
                message: "Payment Successful",
                transactionId: mockTransactionId,
                booking
            });
        } else {
            return res.status(400).json({ success: false, message: "Payment Failed" });
        }

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
