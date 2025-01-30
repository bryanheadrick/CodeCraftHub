/**
 * Main Routes Index
 * Central route configuration
 */

const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');

const logger = require('../config/logger');


// User routes (protected)
router.use('/users', userRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'User Service API',
        timestamp: new Date()
    });
});

// Handle 404 for any unmatched routes
router.use('*', (req, res) => {
    logger.warn('Route not found', { path: req.originalUrl });
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = router;