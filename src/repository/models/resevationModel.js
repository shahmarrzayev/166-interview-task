const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        venueId: {
            type: mongoose.Types.ObjectId,
            ref: 'venues',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
        },
        numberOfPeople: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const Reservation = mongoose.model('reservations', reservationSchema);

module.exports = Reservation;
