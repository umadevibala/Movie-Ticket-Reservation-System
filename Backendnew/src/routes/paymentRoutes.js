const express = require("express");
const router = express.Router();
const { processPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/payment/process - Process a payment
router.post("/process", protect, processPayment);

module.exports = router;
