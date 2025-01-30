/**
 * Authentication Controller
 * Handles user authentication operations
 * 
 * @module controllers/auth
 */

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('../config/logger');
const emailService = require('../services/email.service');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

const authController = {
    /**
     * Register new user
     * @route POST /api/v1/auth/register
     */
    register: async (req, res, next) => {
        try {
            const { email } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            // Create user
            const user = await User.create(req.body);
            
            // Generate verification token
            const verificationToken = user.generateVerificationToken();
            await user.save();

            // Send verification email
            try {
                await emailService.sendVerificationEmail(user.email, verificationToken);
            } catch (error) {
                logger.error('Verification email sending failed', { error: error.message });
            }

            // Generate JWT
            const token = generateToken(user);

            res.status(201).json({
                success: true,
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Login user
     * @route POST /api/v1/auth/login
     */
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Check for user
            const user = await User.findOne({ email }).select('+password');
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

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Your account has been deactivated'
                });
            }

            // Generate token
            const token = generateToken(user);

            res.status(200).json({
                success: true,
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Forgot password
     * @route POST /api/v1/auth/forgot-password
     */
    forgotPassword: async (req, res, next) => {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'No user found with that email'
                });
            }

            // Generate reset token
            const resetToken = user.generateResetPasswordToken();
            await user.save();

            try {
                await emailService.sendPasswordResetEmail(user.email, resetToken);

                res.status(200).json({
                    success: true,
                    message: 'Password reset email sent'
                });
            } catch (error) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save();

                return res.status(500).json({
                    success: false,
                    message: 'Email could not be sent'
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /**
     * Reset password
     * @route POST /api/v1/auth/reset-password/:token
     */
    resetPassword: async (req, res, next) => {
        try {
            // Get hashed token
            const resetPasswordToken = crypto
                .createHash('sha256')
                .update(req.params.token)
                .digest('hex');

            const user = await User.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired reset token'
                });
            }

            // Set new password
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Password reset successful'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Verify email
     * @route POST /api/v1/auth/verify-email/:token
     */
    verifyEmail: async (req, res, next) => {
        try {
            const emailVerificationToken = crypto
                .createHash('sha256')
                .update(req.params.token)
                .digest('hex');

            const user = await User.findOne({
                emailVerificationToken,
                emailVerificationExpire: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired verification token'
                });
            }

            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpire = undefined;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Email verified successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Send verification email
     * @route POST /api/v1/auth/send-verification
     */
    sendVerificationEmail: async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            if (user.isEmailVerified) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already verified'
                });
            }

            const verificationToken = user.generateVerificationToken();
            await user.save();

            try {
                await emailService.sendVerificationEmail(user.email, verificationToken);

                res.status(200).json({
                    success: true,
                    message: 'Verification email sent'
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Email could not be sent'
                });
            }
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;