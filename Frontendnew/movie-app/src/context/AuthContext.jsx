import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem("token");
        return (storedToken && storedToken !== "undefined" && storedToken !== "null") ? storedToken : null;
    });

    useEffect(() => {
        if (token) {
            // ideally verify token validity here, for now just parse stored user if exists
            const storedUser = localStorage.getItem("user");
            if (storedUser && storedUser !== "undefined" && storedUser !== "null") setUser(JSON.parse(storedUser));
        }
    }, [token]);

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
