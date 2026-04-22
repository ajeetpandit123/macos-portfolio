require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const cloudinary = require('cloudinary').v2;
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function nukeAndReset() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const profile = await Profile.findOne();
        
        if (profile && profile.resumeUrl) {
            console.log('Found resume URL:', profile.resumeUrl);
            
            // Try to delete from Cloudinary as 'raw'
            const urlParts = profile.resumeUrl.split('/');
            const uploadIndex = urlParts.indexOf('upload');
            let startIndex = uploadIndex + 1;
            if (urlParts[startIndex].startsWith('v')) startIndex++;
            const publicIdWithExt = urlParts.slice(startIndex).join('/');
            const publicId = publicIdWithExt.includes('.') 
                ? publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'))
                : publicIdWithExt;
            
            console.log('Attempting to delete public_id:', publicId);
            
            // Try both resource types
            try {
                const r1 = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
                console.log('Delete as raw:', r1);
            } catch(e) { console.log('Raw delete failed:', e.message); }
            
            try {
                const r2 = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
                console.log('Delete as image:', r2);
            } catch(e) { console.log('Image delete failed:', e.message); }
        }
        
        // Always clear the database field
        await Profile.updateOne({}, { $unset: { resumeUrl: 1 } });
        console.log('✅ Resume link cleared from database. You can now upload a fresh resume.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

nukeAndReset();
