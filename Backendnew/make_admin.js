const mongoose = require("mongoose");
const User = require("./src/models/User");
require("dotenv").config();

const email = process.argv[2];

if (!email) {
    console.error("Please provide email argument: node make_admin.js <email>");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const user = await User.findOneAndUpdate(
            { email: email },
            { role: "admin" },
            { new: true }
        );

        if (user) {
            console.log(`SUCCESS: User ${user.email} is now an ADMIN.`);
        } else {
            console.log("ERROR: User not found with that email.");
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
