const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get all orders (Admin/Manager)
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'MANAGER'), async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                assignedStaff: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                transactions: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create order (Admin/Manager)
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'MANAGER'), async (req, res) => {
    try {
        const { customerName, customerAddress, customerPhone, cylinderType, assignedStaffId } = req.body;
        const newOrder = await prisma.order.create({
            data: {
                customerName,
                customerAddress,
                customerPhone,
                cylinderType,
                assignedStaffId
            }
        });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update order status/assigned staff (Admin/Manager)
router.patch('/:id', authenticateToken, authorizeRoles('ADMIN', 'MANAGER'), async (req, res) => {
    try {
        const { status, assignedStaffId } = req.body;
        const updatedOrder = await prisma.order.update({
            where: { id: req.params.id },
            data: {
                status: status || undefined,
                assignedStaffId: assignedStaffId || undefined
            }
        });
        res.json(updatedOrder);
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get report for settlement (Admin/Manager)
router.get('/report', authenticateToken, authorizeRoles('ADMIN', 'MANAGER'), async (req, res) => {
    try {
        const { driverId, date } = req.query;
        if (!driverId || !date) {
            return res.status(400).json({ message: 'Driver ID and date are required' });
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await prisma.order.findMany({
            where: {
                assignedStaffId: driverId,
                status: 'DELIVERED',
                updatedAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                transactions: true
            }
        });

        const cashTx = [];
        const upiTx = [];

        orders.forEach(order => {
            order.transactions.forEach(t => {
                const txData = {
                    id: t.id,
                    time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    customer: order.customerName,
                    orderId: order.id.substring(0, 8).toUpperCase(),
                    amount: t.amount,
                    ref: t.id.substring(0, 12).toUpperCase() // Using ID as fallback reference
                };

                if (t.paymentType === 'CASH') cashTx.push(txData);
                else upiTx.push(txData);
            });
        });

        const totalCash = cashTx.reduce((sum, t) => sum + t.amount, 0);
        const totalUPI = upiTx.reduce((sum, t) => sum + t.amount, 0);

        res.json({
            totalCylinders: orders.length,
            cashTransactions: cashTx,
            upiTransactions: upiTx,
            totalCash,
            totalUPI,
            expectedTotal: totalCash + totalUPI
        });
    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
