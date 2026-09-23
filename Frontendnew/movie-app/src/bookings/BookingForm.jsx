import React, { useState } from "react";
import { bookTicket } from "../api";
import { TextField, Button } from "@mui/material";

export default function BookingForm() {
  const [name, setName] = useState("");
  const [movie, setMovie] = useState("");
  const [seats, setSeats] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await bookTicket({ name, movie, seats });
    setName(""); setMovie(""); setSeats("");
    alert("Booking successful!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
      <TextField label="Movie" value={movie} onChange={(e) => setMovie(e.target.value)} fullWidth margin="normal" />
      <TextField label="Seats" value={seats} onChange={(e) => setSeats(e.target.value)} fullWidth margin="normal" />
      <Button type="submit" variant="contained" color="primary">Book Ticket</Button>
    </form>
  );
}
