import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieById, getShowtimesByMovie, getReviews, addReview } from "../api";
import AuthContext from "../context/AuthContext";
import { Container, Typography, Card, CardContent, Grid, Button, Divider, TextField, Rating, Box, List, ListItem, ListItemText } from "@mui/material";

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);

    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const movieRes = await getMovieById(id);
            setMovie(movieRes.data);

            const showtimeRes = await getShowtimesByMovie(id);
            setShowtimes(showtimeRes.data);

            const reviewRes = await getReviews(id);
            setReviews(reviewRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!token) return alert("Please login to review");
        try {
            await addReview({ movieId: id, ...newReview }, token);
            setNewReview({ rating: 5, comment: "" });
            fetchData(); // reload reviews
        } catch (error) {
            alert("Error adding review");
        }
    };

    if (!movie) return <Typography>Loading...</Typography>;

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <img src={movie.poster} alt={movie.title} style={{ width: "100%", borderRadius: "8px" }} />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant="h3">{movie.title}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">{movie.genre} | {movie.duration} mins</Typography>
                    <Box display="flex" alignItems="center" my={1}>
                        <Rating value={movie.rating || 0} readOnly precision={0.5} />
                        <Typography ml={1}>({movie.rating ? movie.rating.toFixed(1) : "No ratings"})</Typography>
                    </Box>
                    <Typography paragraph mt={2}>{movie.description}</Typography>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h5" gutterBottom>Showtimes</Typography>
                    {showtimes.length === 0 ? (
                        <Typography>No showtimes available.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {showtimes.map(st => (
                                <Grid size="auto" key={st._id}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => navigate(`/booking/${st._id}`)}
                                    >
                                        {new Date(st.startTime).toLocaleString()} - ${st.price}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h5" gutterBottom>Reviews</Typography>
                    <List>
                        {reviews.map((stats, index) => (
                            <ListItem key={index} alignItems="flex-start">
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center">
                                            <Rating value={stats.rating} readOnly size="small" />
                                            <Typography variant="body2" ml={1} fontWeight="bold">{stats.user?.username || "User"}</Typography>
                                        </Box>
                                    }
                                    secondary={stats.comment}
                                />
                            </ListItem>
                        ))}
                    </List>

                    {user && (
                        <Box component="form" onSubmit={handleReviewSubmit} mt={2}>
                            <Typography variant="h6">Leave a Review</Typography>
                            <Rating
                                value={newReview.rating}
                                onChange={(e, val) => setNewReview({ ...newReview, rating: val })}
                            />
                            <TextField
                                fullWidth
                                label="Comment"
                                multiline
                                rows={3}
                                margin="normal"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            />
                            <Button type="submit" variant="contained">Submit Review</Button>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}
