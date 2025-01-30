/**
 * Validation Middleware
 * Validates request data for different routes
 * 
 * @module middlewares/validate
 */

const validate = {
    // Validate registration data
    registration: (req, res, next) => {
        const { firstName, lastName, email, password } = req.body;
        const errors = [];

        if (!firstName || firstName.trim().length < 2) {
            errors.push('First name must be at least 2 characters');
        }

        if (!lastName || lastName.trim().length < 2) {
            errors.push('Last name must be at least 2 characters');
        }

        if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            errors.push('Please provide a valid email');
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
        const { email, password } = req.body;
        const errors = [];

        if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            errors.push('Please provide a valid email');
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
    },
    // Validate profile update data
    updateProfile: (req, res, next) => {
        const { firstName, lastName, email } = req.body;
        const errors = [];

        if (firstName && firstName.trim().length < 2) {
            errors.push('First name must be at least 2 characters');
        }

        if (lastName && lastName.trim().length < 2) {
            errors.push('Last name must be at least 2 characters');
        }

        if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            errors.push('Please provide a valid email');
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

    // Validate password change
    changePassword: (req, res, next) => {
        const { currentPassword, newPassword } = req.body;
        const errors = [];

        if (!currentPassword) {
            errors.push('Current password is required');
        }

        if (!newPassword || newPassword.length < 6) {
            errors.push('New password must be at least 6 characters');
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

    // Validate user creation
    createUser: (req, res, next) => {
        const { firstName, lastName, email, password, role } = req.body;
        const errors = [];

        if (!firstName || firstName.trim().length < 2) {
            errors.push('First name must be at least 2 characters');
        }

        if (!lastName || lastName.trim().length < 2) {
            errors.push('Last name must be at least 2 characters');
        }

        if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            errors.push('Please provide a valid email');
        }

        if (!password || password.length < 6) {
            errors.push('Password must be at least 6 characters');
        }

        if (role && !['student', 'instructor', 'admin'].includes(role)) {
            errors.push('Invalid role specified');
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

    // Validate user update
    updateUser: (req, res, next) => {
        const { firstName, lastName, email, role } = req.body;
        const errors = [];

        if (firstName && firstName.trim().length < 2) {
            errors.push('First name must be at least 2 characters');
        }

        if (lastName && lastName.trim().length < 2) {
            errors.push('Last name must be at least 2 characters');
        }

        if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            errors.push('Please provide a valid email');
        }

        if (role && !['student', 'instructor', 'admin'].includes(role)) {
            errors.push('Invalid role specified');
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

    // Validate role update
    updateRole: (req, res, next) => {
        const { role } = req.body;
        const errors = [];

        if (!role || !['student', 'instructor', 'admin'].includes(role)) {
            errors.push('Invalid role specified');
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