/**
 * User Controller
 * Handles user management operations
 * Includes both user and admin level operations
 * 
 * @module controllers/user
 */

const User = require('../models/user.model');
const logger = require('../config/logger');

const userController = {
    /**
     * Get current user's profile
     * @route GET /api/v1/users/me
     * @access Private
     */
    getProfile: async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    },

    
};

module.exports = userController;