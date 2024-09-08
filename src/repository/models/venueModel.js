const mongoose = require('mongoose');

const venueSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'users',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Venue = mongoose.model('venues', venueSchema);

module.exports = Venue;
