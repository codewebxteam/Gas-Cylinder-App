const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get all managers pending approval
router.get('/pending-managers', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const managers = await prisma.user.findMany({
            where: {
                role: 'MANAGER',
                isApproved: false
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true
            }
        });
        res.json(managers);
    } catch (error) {
        console.error('Fetch pending managers error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Approve a manager
router.post('/approve-manager/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.update({
            where: { id },
            data: { isApproved: true }
        });
        res.json({ message: 'Manager approved successfully' });
    } catch (error) {
        console.error('Approve manager error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Reject/Delete a pending manager
router.delete('/reject-manager/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id, isApproved: false }
        });
        res.json({ message: 'Manager rejected successfully' });
    } catch (error) {
        console.error('Reject manager error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
