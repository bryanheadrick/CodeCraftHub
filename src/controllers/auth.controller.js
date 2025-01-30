/**
 * Authentication Controller
 * Handles user registration and login
 */

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const authController = {
    // Register new user
    register: async (req, res, next) => {
        try {
            const { username } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken'
                });
            }

            // Create user
            const user = await User.create(req.body);

            // Generate token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        username: user.username
                    },
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // Login user
    login: async (req, res, next) => {
        try {
            const { username, password } = req.body;

            // Check for user
            const user = await User.findOne({ username }).select('+password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        username: user.username
                    },
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;