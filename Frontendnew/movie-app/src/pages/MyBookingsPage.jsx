import React, { useEffect, useState, useContext } from "react";
import { getMyBookings, cancelBooking } from "../api";
import AuthContext from "../context/AuthContext";
import { Container, Typography, Card, CardContent, Grid, Chip, Button } from "@mui/material";

export default function MyBookingsPage() {
    const { token } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (token) fetchBookings();
    }, [token]);

    const fetchBookings = async () => {
        try {
            const res = await getMyBookings();
            setBookings(res.data);
        } catch (err) {
            setError("Failed to load bookings");
            console.error(err);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await cancelBooking(id);
                setBookings(bookings.filter(b => b._id !== id));
            } catch (err) {
                alert("Failed to cancel booking");
            }
        }
    };

    if (!token) return <Typography sx={{ mt: 4, textAlign: 'center' }}>Please login to view bookings.</Typography>;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>My Bookings</Typography>
            {error && <Typography color="error">{error}</Typography>}

            {bookings.length === 0 ? (
                <Typography>No bookings found.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {bookings.map((booking) => (
                        <Grid size={{ xs: 12, md: 6 }} key={booking._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{booking.showtime?.movie?.title || "Unknown Movie"}</Typography>
                                    <Typography color="text.secondary">
                                        Showtime: {booking.showtime ? new Date(booking.showtime.startTime).toLocaleString() : "N/A"}
                                    </Typography>
                                    <Typography>
                                        Seats: {booking.seats.map(s => `${s.row}${s.number}`).join(", ")}
                                    </Typography>
                                    <Typography>Total: ${booking.totalPrice}</Typography>

                                    <Chip
                                        label={booking.status}
                                        color={booking.status === "confirmed" ? "success" : booking.status === "pending" ? "warning" : "error"}
                                        sx={{ mt: 1 }}
                                    />
                                    {booking.paymentStatus && (
                                        <Chip
                                            label={`Payment: ${booking.paymentStatus}`}
                                            variant="outlined"
                                            size="small"
                                            sx={{ ml: 1, mt: 1 }}
                                        />
                                    )}
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        sx={{ mt: 2, display: 'block' }}
                                        onClick={() => handleCancel(booking._id)}
                                    >
                                        Cancel Booking
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
