const mongoose = require('mongoose');
const dns = require('dns');

// Force using Google DNS for SRV resolution if local DNS fails
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.log('💡 Tip: Please check your IP Whitelist in MongoDB Atlas and your internet connection.');
        process.exit(1);
    }
};

module.exports = connectDB;
