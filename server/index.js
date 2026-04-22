require('dotenv').config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'AjeetPortfolioSecret12345';
process.env.PORT = process.env.PORT || '5010';

process.on('unhandledRejection', (reason, promise) => {
    console.error('😡 UNHANDLED REJECTION:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('😱 UNCAUGHT EXCEPTION:', err);
});

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const messageRoutes = require('./routes/messageRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('💥 SERVER ERROR:', err);
    res.status(500).json({ 
        message: 'Internal Server Error', 
        error: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack 
    });
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
