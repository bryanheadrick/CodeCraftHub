/**
 * Validation Middleware
 * Validates registration and login data
 */

const validate = {
    // Validate registration data
    registration: (req, res, next) => {
        const { username, password } = req.body;
        const errors = [];

        if (!username || username.trim().length < 3) {
            errors.push('Username must be at least 3 characters');
        }

        if (!password || password.length < 6) {
            errors.push('Password must be at least 6 characters');
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

    // Validate login data
    login: (req, res, next) => {
        const { username, password } = req.body;
        const errors = [];

        if (!username) {
            errors.push('Username is required');
        }

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