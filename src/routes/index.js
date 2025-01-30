/**
 * API Routes Index
 * Central route configuration
 * 
 * @module routes/index
 */

const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const logger = require('../config/logger');

// Public routes (no auth required)
router.use('/auth', authRoutes);

// API information route
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'User Service API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/v1/auth',
            users: '/api/v1/users'
        }
    });
});

// Protected routes
router.use('/users', userRoutes);

// Handle 404 for any unmatched routes
router.use('*', (req, res) => {
    logger.warn('Route not found', { path: req.originalUrl });
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = router;