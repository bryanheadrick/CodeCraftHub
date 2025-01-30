/**
 * API Routes Index
 * Central route configuration for the application
 * 
 * @module routes/index
 */

const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

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

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;