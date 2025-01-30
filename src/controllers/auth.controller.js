/**
 * Authentication Controller
 * Handles user registration and login functionality
 * @module controllers/auth
 */

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

/**
 * @typedef {Object} AuthController
 * @property {Function} register - Register a new user
 * @property {Function} login - Authenticate existing user
 */

const authController = {
    /**
     * Register a new user
     * @async
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body
     * @param {string} req.body.username - User's username
     * @param {string} req.body.password - User's password
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @returns {Promise<void>}
     * @throws {Error} When registration fails
     */
    register: async (req, res, next) => {
        try {
            const { username, password } = req.body;

            // Validate input
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide username and password'
                });
            }

            // Validate password strength
            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 8 characters long'
                });
            }

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

    /**
     * Login existing user
     * @async
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body
     * @param {string} req.body.username - User's username
     * @param {string} req.body.password - User's password
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @returns {Promise<void>}
     * @throws {Error} When authentication fails
     */
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

            // Set security headers
            res.set({
                'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
                'X-Frame-Options': 'DENY',
                'X-Content-Type-Options': 'nosniff'
            });

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

/**
 * @type {AuthController}
 */
module.exports = authController;