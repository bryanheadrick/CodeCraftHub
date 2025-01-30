/**
 * Main application file for the User Service
 * This file sets up the Express server, middleware, and routes
 * 
 * @module app
 */

require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
const logger = require('./config/logger');

// Constants
const API_PREFIX = '/';
const DEFAULT_PORT = 3000;

/**
 * Initialize express application
 */
const app = express();

/**
 * Database Connection
 * Establishes connection to MongoDB using configuration from ./config/database
 */
connectDB().catch(err => {
    logger.error('Database connection failed:', err);
    process.exit(1);
});

/**
 * Security Middleware Configuration
 */
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production'
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Request Processing Middleware
 */
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * Health Check Endpoint
 * Used for monitoring service status
 * @route GET /health
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'User Service',
        timestamp: new Date(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

/**
 * API Routes
 * All API routes are prefixed with /api/v1
 */
app.use(API_PREFIX, routes);

/**
 * 404 Handler
 * Catches any requests to undefined routes
 */
app.use((req, res) => {
    logger.warn('Route not found:', {
        path: req.originalUrl,
        method: req.method
    });
    
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

/**
 * Global Error Handler
 * Processes all errors and sends appropriate response
 */
app.use(errorHandler);

/**
 * Server Configuration
 */
const PORT = process.env.PORT || DEFAULT_PORT;

/**
 * Start Server
 * Initializes the server on specified port
 */
const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger.info('Process terminated!');
    });
});

// Export for testing purposes
module.exports = app;