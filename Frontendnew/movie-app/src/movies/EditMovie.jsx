import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Paper, Box, Grid } from "@mui/material";
import api from "../api";

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    title: "",
    description: "", // Added description
    genre: "",
    duration: "",
    poster: ""
  });

  // Fetch existing movie
  useEffect(() => {
    api.get(`/movies/${id}`)
      .then((res) => {
        // Ensure description is validated or defaulted if missing in DB
        const data = res.data;
        if (!data.description) data.description = "";
        setMovie(data);
      })
      .catch((err) => console.error("Error fetching movie:", err));
  }, [id]);

  // Handle form input
  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  // Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/movies/${id}`, movie);
      navigate("/movies"); // Redirect to movie list or detail
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, background: 'linear-gradient(to bottom right, #ffffff, #f7f9fc)' }}>
        <Typography variant="h5" gutterBottom component="h1" align="center" sx={{ fontWeight: 600, color: '#1a237e' }}>
          Edit Movie
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={movie.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            label="Description"
            name="description"
            value={movie.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            multiline
            rows={3}
            variant="outlined"
          />
          <TextField
            label="Genre"
            name="genre"
            value={movie.genre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={movie.duration}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                variant="outlined"
              />
            </Grid>
          </Grid>
          <TextField
            label="Poster URL"
            name="poster"
            value={movie.poster}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            placeholder="https://example.com/image.jpg"
            helperText="Enter a valid direct URL to an image"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            }}
          >
            Update Movie
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
