/**
 * User Routes
 * Protected routes for user management
 * All routes require authentication
 * Admin routes require additional role authorization
 * 
 * @module routes/user
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// Protect all routes under this router
router.use(auth.protect);

// User routes (any authenticated user)
router.get('/me', userController.getProfile);
router.put('/me', validate.updateProfile, userController.updateProfile);
router.put('/me/password', validate.changePassword, userController.changePassword);

// Admin only routes
router.get('/', auth.authorize('admin'), userController.getAllUsers);
router.get('/:id', auth.authorize('admin'), userController.getUserById);
router.post('/', [auth.authorize('admin'), validate.createUser], userController.createUser);
router.put('/:id', [auth.authorize('admin'), validate.updateUser], userController.updateUser);
router.delete('/:id', auth.authorize('admin'), userController.deleteUser);
router.put('/:id/role', [auth.authorize('admin'), validate.updateRole], userController.updateUserRole);
router.put('/:id/status', auth.authorize('admin'), userController.toggleUserStatus);

module.exports = router;