import React, { useEffect, useState, useContext } from "react";
import { getShowtimes, deleteShowtime, getMovies } from "../api";
import AuthContext from "../context/AuthContext";
import { Card, CardContent, Typography, Button, Grid, Box, CardMedia } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function ViewAllShowtimes() {
  const { token, user } = useContext(AuthContext);
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]); // Fallback movies

  const fetchShowtimes = async () => {
    try {
      const res = await getShowtimes();
      setShowtimes(res.data);
      if (res.data.length === 0) {
        fetchMoviesFallback();
      }
    } catch (err) {
      console.error("Failed to load showtimes");
    }
  };

  const fetchMoviesFallback = async () => {
    try {
      const res = await getMovies();
      setMovies(res.data || []);
    } catch (err) {
      console.error("Failed to load movies fallback");
    }
  };

  const handleDelete = async (id) => {
    if (!token || user?.role !== 'admin') {
      return alert("Access Denied: Admins only");
    }
    if (window.confirm("Are you sure you want to delete this showtime?")) {
      try {
        await deleteShowtime(id, token);
        fetchShowtimes();
      } catch (err) {
        alert("Failed to delete showtime: " + (err.response?.data?.message || err.message));
      }
    }
  };

  useEffect(() => {
    fetchShowtimes();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4, textAlign: 'center' }}>
        Movie Schedules
      </Typography>

      {showtimes.length === 0 ? (
        <Box>
          <Typography variant="h6" align="center" mt={4} mb={2} color="text.secondary">
            No showtimes currently scheduled. Here are the movies playing:
          </Typography>
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid size={{ xs: 12, md: 4, lg: 3 }} key={movie._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={movie.poster || "https://via.placeholder.com/300x450"}
                    alt={movie.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{movie.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{movie.genre}</Typography>
                    <Button variant="outlined" fullWidth sx={{ mt: 1 }} href={`/movie/${movie._id}`}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {movies.length === 0 && <Typography align="center">No movies found either.</Typography>}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {showtimes.map((show) => (
            <Grid size={{ xs: 12, md: 4, lg: 3 }} key={show._id}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' },
                position: 'relative'
              }}>
                {show.movie?.poster && (
                  <CardMedia
                    component="img"
                    height="250"
                    image={show.movie.poster}
                    alt={show.movie?.title}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                    {show.movie?.title || "Unknown Movie"}
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={1} mb={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Date:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {show.startTime ? new Date(show.startTime).toLocaleDateString() : "N/A"}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Time:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {show.startTime ? new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Screen:</Typography>
                      <Typography variant="body2">{show.screen || "N/A"}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Price:</Typography>
                      <Typography variant="body2" color="secondary" fontWeight="bold">${show.price}</Typography>
                    </Box>
                  </Box>

                  {user && user.role === 'admin' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      fullWidth
                      onClick={() => handleDelete(show._id)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete Showtime
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, background: 'linear-gradient(45deg, #FF4081 30%, #F50057 90%)', fontWeight: 'bold' }}
                    href={`/booking/${show._id}`}
                  >
                    Book Seat
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
