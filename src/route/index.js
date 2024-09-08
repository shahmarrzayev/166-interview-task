const userRoute = require('./private/userRoute');
const venueRoute = require('./private/venueRoute');

const publicAuthRoute = require('./public/authRoute');
const publicVenueRoute = require('./public/venueRoute');

const applyRoutes = (app) => {
    /** Private */
    app.use('/api/users', userRoute);
    app.use('/api/venues', venueRoute);

    /** Public */
    app.use('/api/auth', publicAuthRoute);
    app.use('/api/venues', publicVenueRoute);
};

module.exports = applyRoutes;
