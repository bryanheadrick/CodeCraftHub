/**
 * Validation Middleware
 * Validates user input for authentication routes
 * 
 * @module middlewares/validate
 */

const validator = require('validator');

// Validation constants
const VALIDATION_RULES = {
    USERNAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 30
    },
    PASSWORD: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 128,
        REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,}$/
    }
};

const ERROR_MESSAGES = {
    USERNAME_REQUIRED: 'Username is required',
    USERNAME_LENGTH: `Username must be between ${VALIDATION_RULES.USERNAME.MIN_LENGTH} and ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters`,
    USERNAME_INVALID: 'Username can only contain letters, numbers, and underscores',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_LENGTH: `Password must be between ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} and ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters`,
    PASSWORD_COMPLEXITY: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    EMAIL_INVALID: 'Please provide a valid email address'
};

/**
 * @typedef {Object} ValidationMiddleware
 * @property {Function} registration - Validates registration data
 * @property {Function} login - Validates login data
 */

const validate = {
    /**
     * Validate registration data
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {import('express').NextFunction} next - Express next function
     * @returns {void}
     */
    registration: (req, res, next) => {
        const { username, password } = req.body;
        const errors = [];

        // Username validation
        if (!username) {
            errors.push(ERROR_MESSAGES.USERNAME_REQUIRED);
        } else {
            // Sanitize username
            const sanitizedUsername = validator.trim(username);
            
            if (sanitizedUsername.length < VALIDATION_RULES.USERNAME.MIN_LENGTH || 
                sanitizedUsername.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
                errors.push(ERROR_MESSAGES.USERNAME_LENGTH);
            }
            
            if (!validator.isAlphanumeric(sanitizedUsername, 'en-US', {ignore: '_'})) {
                errors.push(ERROR_MESSAGES.USERNAME_INVALID);
            }

            req.body.username = sanitizedUsername;
        }

        // Password validation
        if (!password) {
            errors.push(ERROR_MESSAGES.PASSWORD_REQUIRED);
        } else {
            if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH || 
                password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
                errors.push(ERROR_MESSAGES.PASSWORD_LENGTH);
            }
            
            if (!VALIDATION_RULES.PASSWORD.REGEX.test(password)) {
                errors.push(ERROR_MESSAGES.PASSWORD_COMPLEXITY);
            }
        }

     
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        next();
    },

    /**
     * Validate login data
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {import('express').NextFunction} next - Express next function
     * @returns {void}
     */
    login: (req, res, next) => {
        const { username, password } = req.body;
        const errors = [];

        if (!username) {
            errors.push(ERROR_MESSAGES.USERNAME_REQUIRED);
        }

        if (!password) {
            errors.push(ERROR_MESSAGES.PASSWORD_REQUIRED);
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Sanitize username before proceeding
        req.body.username = validator.trim(username);

        next();
    }
};

/**
 * @type {ValidationMiddleware}
 */
module.exports = validate;