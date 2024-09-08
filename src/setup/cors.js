const cors = require('cors');
const helmet = require('helmet');

const configureCors = (app) => {
    app.set('trust proxy', true);
    app.use(helmet());
    app.use(
        cors({
            origin: true,
            credentials: true,
            exposedHeaders: ['x-access-token', 'x-refresh-token'],
            methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
        })
    );
};

module.exports = configureCors;
