import axios from "axios";

const API_URL = "http://localhost:5000/api";

const API = axios.create({ baseURL: API_URL });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Auth
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

// Movies
export const getMovies = () => API.get("/movies");
export const getMovieById = (id) => API.get(`/movies/${id}`);
export const addMovie = (movie) => API.post("/movies", movie);
export const updateMovie = (id, movie) => API.put(`/movies/${id}`, movie);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);

// Showtimes
export const getShowtimes = () => API.get("/showtimes");
export const getShowtimesByMovie = (movieId) => API.get(`/showtimes/${movieId}`);
export const getShowtimeById = (id) => API.get(`/showtimes/single/${id}`);
export const addShowtime = (showtime) => API.post("/showtimes", showtime);
export const updateShowtime = (id, showtime) => API.put(`/showtimes/${id}`, showtime);
export const deleteShowtime = (id) => API.delete(`/showtimes/${id}`);

// Booking
export const bookTicket = (booking) => API.post("/bookings", booking);
export const getMyBookings = () => API.get("/bookings/mybookings");
export const cancelBooking = (id) => API.delete(`/bookings/${id}`);

// Reviews
export const addReview = (review) => API.post("/reviews", review);
export const getReviews = (movieId) => API.get(`/reviews/${movieId}`);

// Payment
export const processPayment = (paymentData) => API.post("/payment/process", paymentData);

