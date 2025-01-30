// src/config/database.js
const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 10000, // 10 seconds timeout
            socketTimeoutMS: 45000,  // 45 seconds timeout
        });

        // Add disconnect handler
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        // Add more event handlers
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB error event:', err);
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected successfully');
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error.name === 'MongooseServerSelectionError') {
            logger.error('Unable to connect to MongoDB server. Please check if MongoDB is running:', error);
        } else {
            logger.error('MongoDB connection error:', error);
        }
        // Consider implementing graceful shutdown instead of immediate exit
        await mongoose.connection.close();
        process.exit(1);
    }
};

module.exports = connectDB;