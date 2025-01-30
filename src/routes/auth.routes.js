/**
 * Authentication Routes
 * Handles all authentication related routes
 * 
 * @module routes/auth
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// Authentication routes
router.post('/register', validate.registration, authController.register);
router.post('/login', validate.login, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/verify-email/:token', authController.verifyEmail);

// Protected route for requesting new verification email
router.post(
    '/send-verification', 
    auth.protect, 
    authController.sendVerificationEmail
);

module.exports = router;