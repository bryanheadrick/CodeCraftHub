/**
 * User Controller
 * Handles all user-related business logic and request/response processing
 * 
 * @module controllers/user
 */

const User = require('../models/user.model');
const logger = require('../config/logger');

const userController = {
    /**
     * Create a new user
     * @route POST /api/v1/users
     * @param {Object} req.body - User creation data
     * @param {string} req.body.firstName - User's first name
     * @param {string} req.body.lastName - User's last name
     * @param {string} req.body.email - User's email
     * @param {string} req.body.password - User's password
     * @param {string} [req.body.role=student] - User's role
     * @returns {Object} Created user object
     * @throws {Error} If user creation fails
     */
    createUser: async (req, res, next) => {
        try {
            logger.info('Creating new user', { email: req.body.email });
            const user = await User.create(req.body);
            
            logger.info('User created successfully', { userId: user._id });
            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            logger.error('User creation failed', { error: error.message });
            next(error);
        }
    },

    /**
     * Get all users
     * @route GET /api/v1/users
     * @returns {Array} Array of user objects
     * @throws {Error} If users fetch fails
     */
    getAllUsers: async (req, res, next) => {
        try {
            logger.info('Fetching all users');
            const users = await User.find({});
            
            res.status(200).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            logger.error('Fetching users failed', { error: error.message });
            next(error);
        }
    },

    /**
     * Get a single user by ID
     * @route GET /api/v1/users/:id
     * @param {string} req.params.id - User ID
     * @returns {Object} User object
     * @throws {Error} If user not found or fetch fails
     */
    getUserById: async (req, res, next) => {
        try {
            logger.info('Fetching user by ID', { userId: req.params.id });
            const user = await User.findById(req.params.id);
            
            if (!user) {
                logger.warn('User not found', { userId: req.params.id });
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            logger.error('Fetching user failed', { 
                userId: req.params.id, 
                error: error.message 
            });
            next(error);
        }
    },

    /**
     * Update a user
     * @route PUT /api/v1/users/:id
     * @param {string} req.params.id - User ID
     * @param {Object} req.body - Update data
     * @returns {Object} Updated user object
     * @throws {Error} If user not found or update fails
     */
    updateUser: async (req, res, next) => {
        try {
            logger.info('Updating user', { userId: req.params.id });
            const user = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                { 
                    new: true,
                    runValidators: true
                }
            );

            if (!user) {
                logger.warn('User not found for update', { userId: req.params.id });
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            logger.info('User updated successfully', { userId: user._id });
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            logger.error('User update failed', { 
                userId: req.params.id, 
                error: error.message 
            });
            next(error);
        }
    },

    /**
     * Delete a user
     * @route DELETE /api/v1/users/:id
     * @param {string} req.params.id - User ID
     * @returns {null} No content
     * @throws {Error} If user not found or deletion fails
     */
    deleteUser: async (req, res, next) => {
        try {
            logger.info('Deleting user', { userId: req.params.id });
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                logger.warn('User not found for deletion', { userId: req.params.id });
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            logger.info('User deleted successfully', { userId: req.params.id });
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            logger.error('User deletion failed', { 
                userId: req.params.id, 
                error: error.message 
            });
            next(error);
        }
    }
};

module.exports = userController;