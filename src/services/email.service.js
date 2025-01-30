/**
 * Email Service
 * Handles sending emails for verification and password reset
 * 
 * @module services/email.service
 */

const nodemailer = require('nodemailer');
const logger = require('../config/logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    /**
     * Send verification email
     * @param {string} to - Recipient email
     * @param {string} token - Verification token
     */
    async sendVerificationEmail(to, token) {
        const verificationUrl = `${process.env.APP_URL}/verify-email/${token}`;

        const message = {
            from: process.env.EMAIL_FROM,
            to,
            subject: 'Email Verification',
            html: `
                <h1>Verify Your Email</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationUrl}">${verificationUrl}</a>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't request this verification, please ignore this email.</p>
            `
        };

        try {
            await this.transporter.sendMail(message);
            logger.info('Verification email sent', { to });
        } catch (error) {
            logger.error('Error sending verification email', { error: error.message, to });
            throw new Error('Error sending verification email');
        }
    }

    /**
     * Send password reset email
     * @param {string} to - Recipient email
     * @param {string} token - Reset token
     */
    async sendPasswordResetEmail(to, token) {
        const resetUrl = `${process.env.APP_URL}/reset-password/${token}`;

        const message = {
            from: process.env.EMAIL_FROM,
            to,
            subject: 'Password Reset Request',
            html: `
                <h1>Reset Your Password</h1>
                <p>You are receiving this email because you requested a password reset.</p>
                <p>Please click the link below to reset your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this reset, please ignore this email.</p>
            `
        };

        try {
            await this.transporter.sendMail(message);
            logger.info('Password reset email sent', { to });
        } catch (error) {
            logger.error('Error sending password reset email', { error: error.message, to });
            throw new Error('Error sending password reset email');
        }
    }
}

module.exports = new EmailService();