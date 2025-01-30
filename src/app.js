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

// Initialize express application
const app = express();

/**
 * Database Connection
 * Establishes connection to MongoDB using configuration from ./config/database
 */
connectDB();

/**
 * Middleware Configuration
 * - helmet: Adds various HTTP headers for security
 * - cors: Enables Cross-Origin Resource Sharing
 * - morgan: HTTP request logger
 * - express.json: Parses incoming JSON payloads
 * - express.urlencoded: Parses incoming URL-encoded payloads
 */
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health Check Endpoint
 * Used for monitoring service status
 * @route GET /health
 * @returns {Object} Service status information
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'User Service',
        timestamp: new Date()
    });
});

/**
 * API Routes
 * All API routes are prefixed with /api/v1
 */
app.use('/api/v1', routes);

/**
 * 404 Handler
 * Catches any requests to undefined routes
 */
app.use((req, res) => {
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

// Server Configuration
const PORT = process.env.PORT || 3000;

/**
 * Start Server
 * Initializes the server on specified port
 */
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// Export for testing purposes
module.exports = app;