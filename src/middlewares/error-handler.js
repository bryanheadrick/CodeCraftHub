/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 * 
 * @module middlewares/error-handler
 */

const logger = require('../config/logger');

/**
 * Error response structure
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - Always false for errors
 * @property {Object} error - Error details
 * @property {number} error.statusCode - HTTP status code
 * @property {string} error.message - Error message
 * @property {string} [error.stack] - Stack trace (development only)
 */

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error
    logger.error('Error occurred:', {
        statusCode,
        message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Determine if it's a MongoDB validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: {
                statusCode: 400,
                message: 'Validation Error',
                details: Object.values(err.errors).map(e => e.message)
            }
        });
    }

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            error: {
                statusCode: 409,
                message: 'Duplicate field value entered',
                field: Object.keys(err.keyPattern)[0]
            }
        });
    }

    res.status(statusCode).json({
        success: false,
        error: {
            statusCode,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = errorHandler;