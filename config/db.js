// config/db.js

const mongoose = require('mongoose');
require('dotenv').config(); // To use environment variables from .env file

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process if connection fails
    }
};

module.exports = connectDB;
