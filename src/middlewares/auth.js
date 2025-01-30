/**
 * Authentication Middleware
 * Verifies JWT tokens and handles role-based access
 * 
 * @module middlewares/auth
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../config/logger');

// Constants for token-related strings
const TOKEN_PREFIX = 'Bearer';
const ERROR_MESSAGES = {
    NO_TOKEN: 'Not authorized - No token provided',
    INVALID_TOKEN: 'Not authorized - Invalid token',
    USER_NOT_FOUND: 'Not authorized - User not found',
    INACTIVE_USER: 'Not authorized - User account is inactive',
    UNAUTHORIZED_ROLE: 'Not authorized - Insufficient permissions'
};

/**
 * @typedef {Object} AuthMiddleware
 * @property {Function} protect - JWT verification middleware
 * @property {Function} authorize - Role-based authorization middleware
 */

const auth = {
    /**
     * Verify JWT token and attach user to request
     * @async
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {import('express').NextFunction} next - Express next function
     * @returns {Promise<void>}
     * @throws {Error} When token verification fails
     */
    protect: async (req, res, next) => {
        try {
            let token;

            // Extract token from various locations
            if (req.headers.authorization?.startsWith(TOKEN_PREFIX)) {
                token = req.headers.authorization.split(' ')[1];
            } else if (req.cookies?.token) {
                token = req.cookies.token;
            }

            if (!token) {
                logger.warn('No auth token provided');
                return res.status(401).json({
                    success: false,
                    message: ERROR_MESSAGES.NO_TOKEN
                });
            }

            try {
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Get user from database
                const user = await User.findById(decoded.id);

                // Check if user still exists
                if (!user) {
                    logger.warn('User not found with token');
                    return res.status(401).json({
                        success: false,
                        message: ERROR_MESSAGES.USER_NOT_FOUND
                    });
                }

                // Check if user is active
                if (!user.isActive) {
                    logger.warn('Inactive user attempted access', { userId: user._id });
                    return res.status(401).json({
                        success: false,
                        message: ERROR_MESSAGES.INACTIVE_USER
                    });
                }

                // Attach user to request object
                req.user = user;
                next();
            } catch (error) {
                logger.error('Token verification failed', { 
                    error: error.message,
                    tokenError: error.name 
                });
                return res.status(401).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_TOKEN
                });
            }
        } catch (error) {
            logger.error('Auth middleware error', { error: error.message });
            next(error);
        }
    },

    /**
     * Restrict access to specific roles
     * @param {...string} roles - Allowed roles
     * @returns {import('express').RequestHandler} Express middleware function
     */
    authorize: (...roles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: ERROR_MESSAGES.NO_TOKEN
                });
            }

            if (!roles.includes(req.user.role)) {
                logger.warn('Unauthorized role access attempt', {
                    userId: req.user._id,
                    userRole: req.user.role,
                    requiredRoles: roles
                });
                return res.status(403).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ROLE
                });
            }
            next();
        };
    }
};

/**
 * @type {AuthMiddleware}
 */
module.exports = auth;