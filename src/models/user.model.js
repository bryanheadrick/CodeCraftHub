/**
 * User Model
 * Defines the schema and behavior for User documents in MongoDB
 * Includes password hashing and comparison methods
 * 
 * @module models/user
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * @typedef {Object} UserSchema
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} email - User's email address (unique)
 * @property {string} password - User's hashed password
 * @property {string} role - User's role (student, instructor, or admin)
 * @property {boolean} isActive - User's active status
 * @property {Date} createdAt - Timestamp of user creation
 * @property {Date} updatedAt - Timestamp of last update
 */
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: {
            values: ['student', 'instructor', 'admin'],
            message: '{VALUE} is not a supported role'
        },
        default: 'student'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password; // Remove password from JSON responses
            return ret;
        }
    }
});

/**
 * Pre-save middleware to hash password before saving
 * Only hashes the password if it has been modified
 */
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Compare candidate password with user's hashed password
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Create index for email field to improve query performance
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);