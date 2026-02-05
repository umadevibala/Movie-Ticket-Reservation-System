import React, { useState, useContext } from "react";
import { addMovie } from "../api";
import AuthContext from "../context/AuthContext";
import { TextField, Button, Alert, Container, Typography, Paper, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AddMovie({ onMovieAdded }) {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate(); // Assume we might want to navigate back, though props suggest inline usage.

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Added Description
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("");
  const [poster, setPoster] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setMessage({ type: "error", text: "You must be logged in" });
    if (user.role !== 'admin') return setMessage({ type: "error", text: "Access Denied: Admins only" });

    try {
      // payload now includes description
      await addMovie({ title, description, genre, duration: Number(duration), poster }, token);
      setTitle("");
      setDescription("");
      setGenre("");
      setDuration("");
      setPoster("");
      setMessage({ type: "success", text: "Movie added successfully!" });
      if (onMovieAdded) onMovieAdded();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to add movie" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, background: 'linear-gradient(to bottom right, #ffffff, #f7f9fc)' }}>
        <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontWeight: 600, color: '#1a237e' }}>
          Add New Movie
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Movie Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
            multiline
            rows={3}
            variant="outlined"
          />
          <TextField
            label="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Duration (mins)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                fullWidth
                margin="normal"
                required
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              {/* Placeholder for potential other inline fields */}
            </Grid>
          </Grid>

          <TextField
            label="Poster Image URL"
            value={poster}
            onChange={(e) => setPoster(e.target.value)}
            fullWidth
            margin="normal"
            required
            placeholder="https://example.com/image.jpg"
            helperText="Enter a valid direct URL to an image (ending in .jpg, .png, etc)"
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Add Movie
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

