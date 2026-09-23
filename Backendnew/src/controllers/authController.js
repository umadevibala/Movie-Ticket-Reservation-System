const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const emailQuery = (email) => new RegExp(`^${escapeRegExp(email)}$`, "i");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    let { username, email, password } = req.body;
    email = email?.toLowerCase().trim();
    username = username?.trim();

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email and password are required" });
    }

    console.log(`[AUTH][REGISTER] email=${email}`);

    try {
        const userExists = await User.findOne(emailQuery(email));

        if (userExists) {
            console.log(`[AUTH][REGISTER] user exists email=${email}`);
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        console.log(`[AUTH][REGISTER] created email=${email}, id=${user._id}`);

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const credential = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!credential || !password) {
        return res.status(400).json({ message: "Email or username and password are required" });
    }

    console.log(`[AUTH][LOGIN] credential=${credential}`);

    try {
        const user = await User.findOne({
            $or: [
                { email: emailQuery(credential) },
                { username: new RegExp(`^${escapeRegExp(credential)}$`, "i") },
            ],
        });

        console.log(`[AUTH][LOGIN] found user=${user ? `${user.email} (${user.username})` : 'none'}`);

        if (user && (await user.matchPassword(password))) {
            console.log(`[AUTH][LOGIN] success user=${user.email}`);
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.log(`[AUTH][LOGIN] failed credentials user=${user ? `${user.email} (${user.username})` : 'none'}`);
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(`[AUTH][LOGIN] error`, error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
