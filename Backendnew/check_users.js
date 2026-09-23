const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}).lean();
    console.log('users count', users.length);
    users.forEach(u => console.log(JSON.stringify({email: u.email, username: u.username, role: u.role, passwordHash: u.password})));    
    await mongoose.disconnect();
  } catch (err) {
    console.error('ERROR', err.message);
    process.exit(1);
  }
})();