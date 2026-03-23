require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const prisma = require('./lib/prisma');

const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staff');
const orderRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');

const { createServer } = require('http');
const { initSocket } = require('./lib/socket');

const app = express();

// Only create HTTP server and Socket.IO for local development
let httpServer, io;
if (process.env.NODE_ENV !== 'production') {
    httpServer = createServer(app);
    io = initSocket(httpServer);
} else {
    // For Vercel, just use express app without Socket.IO
    console.log('Running in production mode - Socket.IO disabled for serverless');
}

const PORT = process.env.PORT || 5002;

// Basic rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again later.'
});

app.use(limiter);
app.use(cors({
    origin: ['http://localhost:8081', 'http://10.0.2.2:8081', 'https://gas-cylinder-app.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'GasFlow Backend API', version: '1.0.0' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'GasFlow Backend is running', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server for local development
if (process.env.NODE_ENV !== 'production' && httpServer) {
    httpServer.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
        console.log(`🔒 Rate limiting enabled`);
    });
} else {
    // For production/Vercel, just log that it's ready
    console.log(`🚀 Server ready for production deployment`);
    console.log(`🔒 Rate limiting enabled`);
}

// Export for Vercel
module.exports = app;
