const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const { sendContactEmail } = require('../utils/emailService');

// POST /api/messages — save message and send email notification
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required.' });
        }

        // Save message to MongoDB
        const savedMessage = await Message.create({ name, email, subject, message });

        // Send email notification
        try {
            await sendContactEmail({ name, email, subject, message });
            console.log(`📧 Email notification sent for message from ${name}`);
            res.status(201).json({ success: true, message: 'Message sent and email delivered!', data: savedMessage });
        } catch (emailErr) {
            console.error('⚠️  Email notification failed:', emailErr.message);
            res.status(201).json({ 
                success: true, 
                message: 'Message saved, but email notification failed. Tell the admin their App Password is not set!', 
                emailError: emailErr.message 
            });
        }
    } catch (error) {
        console.error('Message save error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// GET /api/messages — get all messages (admin only)
router.get('/', protect, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
