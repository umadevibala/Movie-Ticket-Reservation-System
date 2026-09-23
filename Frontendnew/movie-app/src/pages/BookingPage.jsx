import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShowtimeById, bookTicket } from "../api";
import AuthContext from "../context/AuthContext";
import { Container, Typography, Grid, Button, Box, Paper, Alert, Divider } from "@mui/material";

export default function BookingPage() {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);

    const [showtime, setShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchShowtime();
    }, [showtimeId]);

    const fetchShowtime = async () => {
        try {
            const res = await getShowtimeById(showtimeId);
            setShowtime(res.data);
        } catch (err) {
            setError("Failed to load showtime");
        }
    };

    const handleSeatClick = (seat) => {
        if (seat.isBooked) return;

        const isSelected = selectedSeats.find(s => s.row === seat.row && s.number === seat.number);
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => !(s.row === seat.row && s.number === seat.number)));
        } else {
            setSelectedSeats([...selectedSeats, { row: seat.row, number: seat.number }]);
        }
    };

    const handleBooking = async () => {
        if (!user) return navigate("/login");
        if (selectedSeats.length === 0) return alert("Select at least one seat");

        try {
            const res = await bookTicket({
                showtimeId,
                seats: selectedSeats
            });

            // Redirect to payment
            navigate(`/payment/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Booking failed");
        }
    };

    if (!showtime) return <Typography sx={{ mt: 5, textAlign: "center" }}>Loading Showtime...</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(to right, #fdfbfb, #ebedee)' }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Select Your Seats
                </Typography>
                <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
                    {showtime.movie.title}
                </Typography>
                <Typography variant="subtitle1" align="center" sx={{ mb: 3, color: '#555' }}>
                    {new Date(showtime.startTime).toLocaleString()}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{
                    width: '100%',
                    height: 40,
                    background: 'linear-gradient(180deg, #b0bec5 0%, #cfd8dc 100%)',
                    mx: 'auto',
                    mb: 4,
                    borderRadius: '50% 50% 0 0 / 20px 20px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="caption" sx={{ color: '#546e7a', fontWeight: 'bold' }}>SCREEN</Typography>
                </Box>

                <Grid container spacing={1} justifyContent="center" sx={{ mb: 4 }}>
                    {showtime.seats.map((seat, index) => {
                        const isSelected = selectedSeats.find(s => s.row === seat.row && s.number === seat.number);
                        const isBooked = seat.isBooked;

                        return (
                            <Grid size="auto" key={index}>
                                <Button
                                    variant={isSelected ? "contained" : "outlined"}
                                    disabled={isBooked}
                                    color={isSelected ? "success" : isBooked ? "grey" : "primary"}
                                    onClick={() => handleSeatClick(seat)}
                                    sx={{
                                        minWidth: 40,
                                        m: 0.5,
                                        borderRadius: '8px 8px 0 0', // Seat shape
                                        height: 35,
                                        backgroundColor: isBooked ? '#e0e0e0' : (isSelected ? '#66bb6a' : 'white'),
                                        borderColor: isBooked ? 'transparent' : '#1976d2',
                                        '&:hover': {
                                            backgroundColor: !isBooked && '#e3f2fd'
                                        }
                                    }}
                                >
                                    {seat.row}{seat.number}
                                </Button>
                            </Grid>
                        )
                    })}
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Total Price: ${selectedSeats.length * showtime.price}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {selectedSeats.length} seat(s) selected
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={handleBooking}
                        disabled={selectedSeats.length === 0}
                        sx={{
                            px: 5,
                            borderRadius: 20,
                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                            textTransform: 'none',
                            fontSize: '1.1rem'
                        }}
                    >
                        Confirm Booking
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
