import React, { useState, useEffect, useContext } from "react";
import { getMovies, addShowtime } from "../api";
import AuthContext from "../context/AuthContext";
import { TextField, Button, MenuItem, Alert } from "@mui/material";

export default function AddShowtime({ onShowtimeAdded }) {
  const { token, user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [movieId, setMovieId] = useState("");
  const [screen, setScreen] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await getMovies();
        setMovies(res.data);
      } catch (err) {
        console.error("Failed to load movies", err);
      }
    };
    fetchMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setMessage({ type: "error", text: "You must be logged in" });
    if (user.role !== 'admin') return setMessage({ type: "error", text: "Access Denied: Admins only" });

    // Combine date and time
    const startTime = new Date(`${date}T${time}`);

    try {
      await addShowtime({ movieId, screen, startTime, price }, token);
      setMovieId(""); setScreen(""); setDate(""); setTime(""); setPrice("");
      setMessage({ type: "success", text: "Showtime added successfully!" });
      onShowtimeAdded();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to add showtime" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message.text && <Alert severity={message.type}>{message.text}</Alert>}
      <TextField select label="Select Movie" value={movieId} onChange={(e) => setMovieId(e.target.value)} fullWidth margin="normal" required>
        {movies.map((movie) => (
          <MenuItem key={movie._id} value={movie._id}>{movie.title}</MenuItem>
        ))}
      </TextField>
      <TextField label="Screen Number" value={screen} onChange={(e) => setScreen(e.target.value)} fullWidth margin="normal" required />
      <TextField type="date" label="Date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
      <TextField type="time" label="Time" value={time} onChange={(e) => setTime(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
      <TextField type="number" label="Price ($)" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth margin="normal" required />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Add Showtime</Button>
    </form>
  );
}
