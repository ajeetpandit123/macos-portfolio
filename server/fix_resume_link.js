require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function fixProfile() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const result = await Profile.updateOne({}, { $unset: { resumeUrl: 1 } });
        console.log('✅ Success: Broken resume link removed from database.');
        console.log('Result:', result);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error fixing profile:', err.message);
        process.exit(1);
    }
}

fixProfile();
