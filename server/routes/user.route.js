const router = require('express').Router();
const userController = require('../controller/user.controller');
const { verify, verifyAdmin } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all user routes
router.use(verify);

// GET /api/users/profile - Get current user profile
router.get('/profile', userController.getProfile);

// PUT /api/users/profile - Update current user profile
router.put('/profile', userController.updateProfile);

// Admin-only routes
// GET /api/users - Get all users (admin only)
router.get('/', verify, verifyAdmin, userController.getAllUsers);

// GET /api/users/:id - Get user by ID (admin or own profile)
router.get('/:id', userController.getUserById);

// PUT /api/users/:id - Update user (admin or own profile)
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete user (admin or own profile)
router.delete('/:id', userController.deleteUser);

module.exports = router;