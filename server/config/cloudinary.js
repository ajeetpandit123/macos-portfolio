delete process.env.CLOUDINARY_URL; // Nuclear fix: prevent ANY interference
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Final, absolute hardcoded configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Immediate verification log
console.log('✅ CLOUDINARY FINAL CHECK: Using API Key starting with', '465745...');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isPDF = file.mimetype === 'application/pdf';
        return {
            folder: 'portfolio',
            resource_type: isPDF ? 'raw' : 'image',
            type: 'upload', // Ensure it's a public upload
            access_mode: 'public', // Explicitly set to public
        };
    },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
