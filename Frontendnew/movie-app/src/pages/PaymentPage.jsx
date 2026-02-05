import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { processPayment } from "../api";
import AuthContext from "../context/AuthContext";
import { Container, Typography, Button, Paper, CircularProgress, Alert } from "@mui/material";

export default function PaymentPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        setError("");

        try {
            // Simulate fake payment data
            await processPayment({
                bookingId,
                amount: 100, // In real app, fetch amount from booking
                paymentMethod: "Credit Card"
            }, token);

            setSuccess(true);
            setTimeout(() => {
                navigate("/");
                alert("Payment Successful! Booking Confirmed.");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Payment Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Payment</Typography>
                <Typography paragraph>Please confirm your payment to finalize booking.</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>Payment Successful! Redirecting...</Alert>}

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handlePayment}
                    disabled={loading || success}
                >
                    {loading ? <CircularProgress size={24} /> : "Pay Now"}
                </Button>
            </Paper>
        </Container>
    );
}
