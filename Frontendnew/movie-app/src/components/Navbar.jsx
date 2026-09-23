import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Container } from "@mui/material";
import MovieIcon from '@mui/icons-material/Movie'; // Make sure to verify icons install, if not I'll just use text. Assuming generic icons exist or just text.

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path ? { fontWeight: "bold", borderBottom: "2px solid #fff" } : {};

    return (
        <AppBar position="static" sx={{
            background: 'linear-gradient(90deg, #1a237e 0%, #283593 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            cursor: "pointer",
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            letterSpacing: '1px'
                        }}
                        onClick={() => navigate("/")}
                    >
                        🎬 CinemaBook
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button color="inherit" component={Link} to="/" sx={{ ...isActive('/') }}>Home</Button>
                        <Button color="inherit" component={Link} to="/movies" sx={{ ...isActive('/movies') }}>Movies</Button>

                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Button color="inherit" component={Link} to="/admin" sx={{ ...isActive('/admin'), backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                        Admin Dashboard
                                    </Button>
                                )}
                                <Button color="inherit" component={Link} to="/my-bookings" sx={{ ...isActive('/my-bookings') }}>My Bookings</Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={handleLogout}
                                    sx={{ ml: 2, borderColor: 'rgba(255,255,255,0.5)' }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login" sx={{ ...isActive('/login') }}>Login</Button>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/register"
                                    sx={{
                                        ml: 1,
                                        backgroundColor: '#ff4081',
                                        color: 'white',
                                        '&:hover': { backgroundColor: '#f50057' }
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
