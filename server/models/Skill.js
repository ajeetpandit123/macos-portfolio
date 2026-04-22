const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String }, // Can be lucide icon name or URL
    category: { type: String, enum: ['Frontend', 'Backend', 'Tools', 'Other'], default: 'Other' },
    proficiency: { type: Number, min: 0, max: 100 },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
