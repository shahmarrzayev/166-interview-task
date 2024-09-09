require('express-async-errors');
const express = require('express');
const winston = require('winston');

const ServerlessHttp = require('serverless-http');
const { Env } = require('../src/enums');
const configureCors = require('../src/setup/cors');
const setupCache = require('../src/setup/cache');
const setupDbConnection = require('../src/setup/db');
const setupAndCheckEnvironment = require('../src/setup/environment');
const configureLogger = require('../src/setup/logger');
const setupRoutes = require('../src/setup/routes');
const { getFromEnv } = require('../src/utils/commonUtils');

process.on('uncaughtException', (err) => {
    winston.error(`Uncaught exception: ${err}`);
    process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
    winston.error(`Unhandled rejection: ${reason}, ${p}`);
    process.exit(1);
});

setupAndCheckEnvironment();
configureLogger();

const app = express();
app.get('/.netlify/functions/api', (req, res) => res.send('Hello World!'));

configureCors(app);
setupRoutes(app);
setupDbConnection()
    .then(() => {
        setupCache();

        const port = getFromEnv(Env.PORT) || 3000;
        app.listen(port, () => winston.info(`Listening on port ${port}...`));
    })
    .catch(() => process.exit(1));

const handler = ServerlessHttp(app);
module.exports.handler = handler;
