/**
 * Authentication Routes
 * Handles all authentication related routes
 * 
 * @module routes/auth
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');

// Register new user
router.post('/register', validate.registration, authController.register);

// Login user
router.post('/login', validate.login, authController.login);

module.exports = router;