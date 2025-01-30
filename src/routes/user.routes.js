/**
 * User Routes
 * Only handles getting user profile
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth');

// Get own profile (protected route)
router.get('/me', auth.protect, userController.getProfile);
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');

// Register user
router.post('/register', validate.registration, authController.register);

// Login user
router.post('/login', validate.login, authController.login);

module.exports = router;

module.exports = router;