const bodyParser = require('body-parser');

const errorMiddleware = require('../middleware/errorMw');
const applyRoutes = require('../route/index');

const setupRoutes = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/.netlify/functions/api', (req, res, next) => {
        next();
    });
    applyRoutes(app);
    app.use(errorMiddleware);
};

module.exports = setupRoutes;
