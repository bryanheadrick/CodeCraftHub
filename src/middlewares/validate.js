/**
 * Validation Middleware
 * Validates incoming request data
 * 
 * @module middlewares/validate
 */

const validate = {
    /**
     * Validate user registration data
     */
    registration: (req, res, next) => {
        const { firstName, lastName, email, password } = req.body;
        const errors = [];

        // Validate firstName
        if (!firstName || firstName.trim().length === 0) {
            errors.push('First name is required');
        }

        // Validate lastName
        if (!lastName || lastName.trim().length === 0) {
            errors.push('Last name is required');
        }

        // Validate email
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push('Valid email is required');
        }

        // Validate password
        if (!password || password.length < 6) {
            errors.push('Password must be at least 6 characters long');
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
     */
    login: (req, res, next) => {
        const { email, password } = req.body;
        const errors = [];

        // Validate email
        if (!email) {
            errors.push('Email is required');
        }

        // Validate password
        if (!password) {
            errors.push('Password is required');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        next();
    }
};

module.exports = validate;