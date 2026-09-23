import React from "react";
import { Container, Typography, Button, Box, Paper, Grid } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center',
        borderBottomLeftRadius: '50px',
        borderBottomRightRadius: '50px',
        mb: 5,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, letterSpacing: '-1px' }}>
            CinemaBook
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 300, opacity: 0.9 }}>
            Your Premium Movie Experience Starts Here
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/movies"
            sx={{
              borderRadius: '50px',
              px: 5,
              py: 1.5,
              fontSize: '1.2rem',
              background: '#00e5ff',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { background: '#00b8d4' }
            }}
          >
            Book Tickets Now
          </Button>
        </Container>
      </Box>

      {/* Features / Actions Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
              <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                🎬 Latest Movies
              </Typography>
              <Typography paragraph color="text.secondary">
                Browse our collection of the latest blockbusters and indie gems. Find your next favorite film today.
              </Typography>
              <Button variant="outlined" component={Link} to="/movies" fullWidth sx={{ mt: 2 }}>
                Browse Movies
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
              <Typography variant="h4" gutterBottom color="secondary" sx={{ fontWeight: 600 }}>
                📅 Showtimes
              </Typography>
              <Typography paragraph color="text.secondary">
                Check showtimes and book your seats in advance. We offer premium seating and Dolby Atmos screens.
              </Typography>
              <Button variant="outlined" color="secondary" component={Link} to="/showtimes" fullWidth sx={{ mt: 2 }}>
                View Schedule
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
