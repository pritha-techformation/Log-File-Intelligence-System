// models/auth.model.js

// import mongoose to connect to MongoDB
const mongoose = require('mongoose');
// import bcrypt to encrypt password
const bcrypt = require('bcryptjs');

// create a schema for authentication
const authSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        status: {
            type: String,
            enum: [ 'pending', 'approved', 'inactive'],
            default: 'pending',
        },
    },
    { timestamps: true }
);


// Method to compare passwords
authSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Auth', authSchema);