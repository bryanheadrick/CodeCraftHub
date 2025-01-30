/**
 * User Routes
 * Handles all user-related routes including authentication
 * @module routes/user
 */

const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

// Middlewares
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

/**
 * Authentication Routes
 * @route POST /users/register
 * @route POST /users/login
 */
router.post('/register', validate.registration, authController.register);

// Login user
router.post('/login', validate.login, authController.login);

/**
 * Protected User Routes
 * Requires authentication
 * @route GET /users/me
 */
router.get('/me', auth.protect, userController.getProfile);

module.exports = router;