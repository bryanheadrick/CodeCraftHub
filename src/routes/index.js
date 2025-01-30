// src/routes/index.js
const express = require('express');
const userRoutes = require('./user.routes');

const router = express.Router();

// API information route
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to User Service API',
        version: '1.0.0',
        endpoints: {
            users: '/api/v1/users',
            health: '/health'
        }
    });
});

// Mount user routes
router.use('/users', userRoutes);

// Export router
module.exports = router;