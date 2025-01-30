/**
 * Main Routes Index
 * Central route configuration and route handling
 * @module routes/index
 */

const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const logger = require('../config/logger');

// Constants
const API_VERSION = 'v1';
const ROUTES = {
    USERS: '/users',
    HEALTH: '/health'
};

/**
 * Register all application routes
 */

// API version prefix (optional)
// router.use(`/${API_VERSION}`, ...);

// User routes (protected)
router.use(ROUTES.USERS, userRoutes);

/**
 * @route GET /health
 * @description Health check endpoint for monitoring
 * @access Public
 */
router.get(ROUTES.HEALTH, (req, res) => {
    const healthData = {
        status: 'success',
        message: 'User Service API',
        timestamp: new Date(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV
    };

    logger.info('Health check requested', healthData);
    res.json(healthData);
});

/**
 * @route * /*
 * @description Catch-all route for unmatched paths
 * @access Public
 */
router.use('*', (req, res) => {
    const errorData = {
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date()
    };

    logger.warn('Route not found', errorData);
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

module.exports = router;