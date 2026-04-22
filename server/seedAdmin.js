require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const User = require('./models/User');

// Force using Google DNS for SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const seedAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to MongoDB.');

        // Default Admin Credentials
        const username = 'Ajeet';
        const password = 'Ajeet@1902';

        // Check if admin already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Admin user already exists!');
            console.log(`Username: ${username}`);
            // Force reset password just in case
            existingUser.password = password;
            await existingUser.save();
            console.log(`Password reset to: ${password}`);
        } else {
            // Create new admin
            await User.create({ username, password });
            console.log('Admin user created successfully!');
            console.log(`Username: ${username}`);
            console.log(`Password: ${password}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin user:', error.message);
        process.exit(1);
    }
};

seedAdmin();
