/**
 * Authentication Middleware
 * Verifies JWT tokens and handles role-based access
 * 
 * @module middlewares/auth
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../config/logger');

const auth = {
    /**
     * Verify JWT token and attach user to request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    protect: async (req, res, next) => {
        try {
            let token;

            // Check for token in headers
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                token = req.headers.authorization.split(' ')[1];
            }

            // Check if token exists
            if (!token) {
                logger.warn('No auth token provided');
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized to access this route'
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
                        message: 'User not found'
                    });
                }

                // Check if user is active
                if (!user.isActive) {
                    logger.warn('Inactive user attempted access', { userId: user._id });
                    return res.status(401).json({
                        success: false,
                        message: 'User account is inactive'
                    });
                }

                // Attach user to request object
                req.user = user;
                next();
            } catch (error) {
                logger.error('Token verification failed', { error: error.message });
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized to access this route'
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
     */
    authorize: (...roles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
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
                    message: `User role ${req.user.role} is not authorized to access this route`
                });
            }
            next();
        };
    }
};

module.exports = auth;