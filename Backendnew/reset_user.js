const mongoose = require("mongoose");
const User = require("./src/models/User");
require("dotenv").config();

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const email = "umadevi.balam@sasi.ac.in";
        let user = await User.findOne({ email });

        if (user) {
            user.password = "password123";
            user.role = "admin";
            await user.save();
            console.log(`Successfully reset user ${email} password to 'password123' and role to 'admin'.`);
        } else {
            user = await User.create({
                username: "umadevi",
                email: email,
                password: "password123",
                role: "admin"
            });
            console.log(`Successfully created admin user ${email} with password 'password123'.`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("ERROR:", err.message);
        process.exit(1);
    }
})();
