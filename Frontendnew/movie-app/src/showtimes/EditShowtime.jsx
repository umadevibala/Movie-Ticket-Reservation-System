import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button } from "@mui/material";
import api from "../api";

export default function EditShowtime() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState({
    movieId: "",
    screen: "",
    date: "",
    time: ""
  });

  // Fetch existing showtime
  useEffect(() => {
    api.get(`/showtimes/${id}`)
      .then((res) => setShowtime(res.data))
      .catch((err) => console.error("Error fetching showtime:", err));
  }, [id]);

  // Handle form input
  const handleChange = (e) => {
    setShowtime({ ...showtime, [e.target.name]: e.target.value });
  };

  // Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/showtimes/${id}`, showtime);
      navigate("/showtimes");
    } catch (error) {
      console.error("Error updating showtime:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>Edit Showtime</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Movie ID"
          name="movieId"
          value={showtime.movieId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Screen"
          name="screen"
          value={showtime.screen}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={showtime.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Time"
          name="time"
          type="time"
          value={showtime.time}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained" color="primary">Update</Button>
      </form>
    </Container>
  );
}
