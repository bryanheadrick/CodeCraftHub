/**
 * User Controller
 * Handles user management operations
 * Includes both user and admin level operations
 * 
 * @module controllers/user
 */

const User = require('../models/user.model');
const logger = require('../config/logger');

/**
 * @typedef {Object} UserController
 * @property {Function} getProfile - Get current user's profile
 */

const userController = {
    /**
     * Get current user's profile
     * @async
     * @param {Object} req - Express request object
     * @param {Object} req.user - Authenticated user object
     * @param {string} req.user.id - User ID
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @returns {Promise<void>}
     * @throws {Error} When user retrieval fails
     */
    getProfile: async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id)
                .select('username createdAt updatedAt');  // Explicitly select fields

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            logger.info(`User profile retrieved: ${user.id}`);
            
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            logger.error(`Error retrieving user profile: ${error.message}`);
            next(error);
        }
    },

    
};

/**
 * @type {UserController}
 */
module.exports = userController;