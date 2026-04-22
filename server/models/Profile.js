const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    about: { type: String, required: true },
    intro: { type: String },
    profileImage: { type: String },
    resumeUrl: { type: String },
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        email: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
