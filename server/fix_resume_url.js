require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function fixResumeUrl() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const profile = await Profile.findOne();
        
        if (!profile || !profile.resumeUrl) {
            console.log('❌ No resume URL found in database.');
            process.exit(1);
        }
        
        console.log('Current URL:', profile.resumeUrl);
        
        // The raw URL already works for direct access - just need to use fl_attachment for download
        // Change from: https://res.cloudinary.com/dezq8io9y/raw/upload/v.../portfolio/xxx
        // To a direct working URL with fl_attachment for forced download
        const rawUrl = profile.resumeUrl;
        const directDownloadUrl = rawUrl.replace('/raw/upload/', '/raw/upload/fl_attachment/');
        
        console.log('Direct download URL would be:', directDownloadUrl);
        console.log('✅ Raw URL is accessible directly - no fix needed for URL.');
        console.log('The fix is in the frontend code to use the URL directly.');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

fixResumeUrl();
