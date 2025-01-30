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

    /**
     * Update current user's profile
     * @route PUT /api/v1/users/me
     * @access Private
     */
    updateProfile: async (req, res, next) => {
        try {
            // Fields that users can update
            const allowedUpdates = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            };

            const user = await User.findByIdAndUpdate(
                req.user.id,
                allowedUpdates,
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Change current user's password
     * @route PUT /api/v1/users/me/password
     * @access Private
     */
    changePassword: async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).select('+password');
            
            // Check current password
            const isMatch = await user.comparePassword(req.body.currentPassword);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Update password
            user.password = req.body.newPassword;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get all users (admin only)
     * @route GET /api/v1/users
     * @access Admin
     */
    getAllUsers: async (req, res, next) => {
        try {
            // Add pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const startIndex = (page - 1) * limit;

            const users = await User.find()
                .skip(startIndex)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await User.countDocuments();

            res.status(200).json({
                success: true,
                count: users.length,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                data: users
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get specific user (admin only)
     * @route GET /api/v1/users/:id
     * @access Admin
     */
    getUserById: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
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
            next(error);
        }
    },

    /**
     * Create new user (admin only)
     * @route POST /api/v1/users
     * @access Admin
     */
    createUser: async (req, res, next) => {
        try {
            const user = await User.create(req.body);
            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update user (admin only)
     * @route PUT /api/v1/users/:id
     * @access Admin
     */
    updateUser: async (req, res, next) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!user) {
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
            next(error);
        }
    },

    /**
     * Update user role (admin only)
     * @route PUT /api/v1/users/:id/role
     * @access Admin
     */
    updateUserRole: async (req, res, next) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { role: req.body.role },
                { new: true, runValidators: true }
            );

            if (!user) {
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
            next(error);
        }
    },

    /**
     * Toggle user active status (admin only)
     * @route PUT /api/v1/users/:id/status
     * @access Admin
     */
    toggleUserStatus: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            user.isActive = !user.isActive;
            await user.save();

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Delete user (admin only)
     * @route DELETE /api/v1/users/:id
     * @access Admin
     */
    deleteUser: async (req, res, next) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = userController;