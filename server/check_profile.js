require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function checkProfile() {
    await mongoose.connect(process.env.MONGODB_URI);
    const profile = await Profile.findOne();
    console.log('Profile:', JSON.stringify(profile, null, 2));
    process.exit();
}

checkProfile();
