require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'GasFlow Backend is running' });
});

// Sample route to check DB connection
app.get('/test-db', async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        res.json({ success: true, userCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Database connection failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
