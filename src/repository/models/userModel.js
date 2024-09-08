const mongoose = require('mongoose');

const { UserRole } = require('../../enums');

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            minlength: 4,
            maxlength: 256,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            minlength: 1,
            maxlength: 15,
            required: true,
        },
        role: { type: String, enum: Object.values(UserRole) },
    },
    { timestamps: true }
);

const User = mongoose.model('users', userSchema);

module.exports = User;
