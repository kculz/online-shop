// routes/rentalRoutes.js
const router = require('express').Router();
const rentalController = require('../controller/rental.controller');
const { verify, verifyAdmin } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all rental routes
router.use(verify);

// GET /api/rentals - Get user's rentals (for regular users)
router.get('/', rentalController.getUserRentals);

// Admin-only routes
// GET /api/rentals/all - Get all rentals (admin only)
router.get('/all', verifyAdmin, rentalController.getAllRentals);

// POST /api/rentals/:rentalId/return - Process rental return (admin only)
router.post('/:rentalId/return', verifyAdmin, rentalController.processReturn);

// GET /api/rentals/overdue/check - Check for overdue rentals (admin only)
router.get('/overdue/check', verifyAdmin, rentalController.checkOverdueRentals);

module.exports = router;