import React, { useEffect, useState, useContext } from "react";
import { getMovies, deleteMovie } from "../api";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Card, CardContent, Typography, Button, Grid, Box, CardMedia, Chip, IconButton, CircularProgress, Alert } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function ViewAllMovies() {
  const { token, user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMovies();
      // Ensure res.data is an array
      if (Array.isArray(res.data)) {
        setMovies(res.data);
      } else {
        setMovies([]); // Fallback
        console.error("API returned non-array data:", res.data);
      }
    } catch (err) {
      console.error("Failed to fetch movies", err);
      // Display a friendly message, but logout specific network errors if helpful
      setError("Unable to load movies. Please check your internet connection or try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token || user.role !== 'admin') return alert("Access Denied: Admins only");
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await deleteMovie(id, token);
        fetchMovies();
      } catch (err) {
        alert("Failed to delete movie");
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4, textAlign: 'center' }}>
        Now Showing
      </Typography>

      {error && (
        <Box mb={3} display="flex" justifyContent="center">
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!error && movies.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">No movies found.</Typography>
          <Typography variant="body1">Go to <Link to="/admin">Admin Dashboard</Link> to add movies.</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={movie._id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: '0.3s',
              '&:hover': { transform: 'scale(1.02)', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }
            }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="350"
                  image={movie.poster ? movie.poster : "https://via.placeholder.com/300x450?text=No+Poster"}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x450?text=Image+Not+Found";
                  }}
                  sx={{ objectFit: 'cover' }}
                />
                <Chip label={movie.genre} color="primary" size="small" sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 'bold' }} />
              </Box>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  ⏱ {movie.duration} mins
                </Typography>

                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/movie/${movie._id}`}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      fontWeight: 'bold'
                    }}
                  >
                    Details
                  </Button>
                  {user && user.role === 'admin' && (
                    <IconButton color="error" onClick={() => handleDelete(movie._id)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box >
  );
}
