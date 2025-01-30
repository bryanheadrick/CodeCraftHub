// src/controllers/user.controller.js
const User = require('../models/user.model');

const userController = {
    // Create a new user
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

    // Get all users
    getAllUsers: async (req, res, next) => {
        try {
            const users = await User.find({});
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            next(error);
        }
    },

    // Get a single user by ID
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

    // Update a user
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

    // Delete a user
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