/**
 * User Model
 * Represents a user in the system
 * @module models/user
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @typedef {Object} UserDocument
 * @property {string} username - User's unique username
 * @property {string} password - Hashed password
 * @property {string} role - User's role (default: 'user')
 * @property {boolean} isActive - Whether the user account is active
 * @property {Date} lastLogin - Last login timestamp
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for optimization
userSchema.index({ username: 1 });
userSchema.index({ createdAt: 1 });

/**
 * Hash password before saving
 * @async
 * @param {Function} next - Mongoose middleware next function
 */
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Compare provided password with stored hash
 * @async
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} True if passwords match
 * @throws {Error} If comparison fails
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

/**
 * Update last login timestamp
 * @async
 * @returns {Promise<void>}
 */
userSchema.methods.updateLastLogin = async function() {
    this.lastLogin = new Date();
    return this.save();
};

/**
 * Check if user is admin
 * @returns {boolean}
 */
userSchema.methods.isAdmin = function() {
    return this.role === 'admin';
};

const User = mongoose.model('User', userSchema);

module.exports = User;