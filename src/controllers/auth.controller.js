/**
 * Authentication Controller
 * Handles user registration and login
 * 
 * @module controllers/auth
 */

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authController = {
    /**
     * Register a new user
     * @route POST /api/v1/auth/register
     * @param {Object} req.body - Registration data
     * @param {string} req.body.firstName - User's first name
     * @param {string} req.body.lastName - User's last name
     * @param {string} req.body.email - User's email
     * @param {string} req.body.password - User's password
     * @returns {Object} User object with JWT token
     */
    register: async (req, res, next) => {
        try {
            const { email } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                logger.warn('Registration failed - Email already exists', { email });
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            // Create new user
            const user = await User.create(req.body);
            
            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            logger.info('User registered successfully', { userId: user._id });
            
            res.status(201).json({
                success: true,
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            logger.error('Registration failed', { error: error.message });
            next(error);
        }
    },

    /**
     * Login user
     * @route POST /api/v1/auth/login
     * @param {Object} req.body - Login credentials
     * @param {string} req.body.email - User's email
     * @param {string} req.body.password - User's password
     * @returns {Object} User object with JWT token
     */
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Validate email and password are provided
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide email and password'
                });
            }

            // Find user and include password for comparison
            const user = await User.findOne({ email });

            // Check if user exists
            if (!user) {
                logger.warn('Login failed - User not found', { email });
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check if password matches
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                logger.warn('Login failed - Invalid password', { email });
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            logger.info('User logged in successfully', { userId: user._id });

            res.status(200).json({
                success: true,
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            logger.error('Login failed', { error: error.message });
            next(error);
        }
    }
};

module.exports = authController;