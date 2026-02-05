const mongoose = require("mongoose");
const User = require("./src/models/User");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const users = await User.find({});
        console.log("Registered Users:");
        users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
