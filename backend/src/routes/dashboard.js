const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/stats', authenticateToken, authorizeRoles('ADMIN', 'MANAGER'), async (req, res) => {
    try {
        const [
            activeDrivers,
            pendingOrders,
            deliveredToday,
            cancelledOrders,
            transactions
        ] = await Promise.all([
            prisma.user.count({ where: { role: 'DRIVER' } }),
            prisma.order.count({ where: { status: 'PENDING' } }),
            prisma.order.count({
                where: {
                    status: 'DELIVERED',
                    updatedAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),
            prisma.order.count({ where: { status: 'CANCELLED' } }),
            prisma.transaction.findMany({
                where: {
                    timestamp: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            })
        ]);

        const totalCollection = transactions.reduce((sum, text) => sum + text.amount, 0);
        const cashCollection = transactions.filter(t => t.paymentType === 'CASH').reduce((sum, t) => sum + t.amount, 0);
        const upiCollection = transactions.filter(t => t.paymentType === 'UPI').reduce((sum, t) => sum + t.amount, 0);

        res.json({
            metrics: {
                activeDrivers,
                pendingOrders,
                deliveredToday,
                cancelledOrders,
                totalCollection,
                cashCollection,
                upiCollection
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
