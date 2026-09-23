import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ViewAllMovies from "./movies/ViewAllMovies";
import AddMovie from "./movies/AddMovie";
import AddShowtime from "./showtimes/AddShowtime";
import ViewAllShowtimes from "./showtimes/ViewAllShowtimes";
import MovieDetail from "./pages/MovieDetail";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import { Container, Typography } from "@mui/material";
import HomePage from "./HomePage";
const AdminDashboard = () => (
  <Container>
    <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
    <Typography variant="h5">Add Movie</Typography>
    <AddMovie onMovieAdded={() => window.location.reload()} />
    <Typography variant="h5" style={{ marginTop: "30px" }}>Add Showtime</Typography>
    <AddShowtime onShowtimeAdded={() => window.location.reload()} />
  </Container>
);

const Home = () => (
  <Container sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>Now Showing</Typography>
    <ViewAllMovies />
  </Container>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<ViewAllMovies />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/booking/:showtimeId" element={<BookingPage />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/showtimes" element={<ViewAllShowtimes />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
