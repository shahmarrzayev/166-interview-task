const mongoose = require('mongoose');
const winston = require('winston');

const { Env } = require('../enums');
const { getFromEnv } = require('../utils/commonUtils');

const setupDbConnection = () => {
    return new Promise((resolve, reject) => {
        // let dbAddr = `mongodb://${getFromEnv(Env.DB_USER)}:${getFromEnv(Env.DB_PASSWORD)}@${getFromEnv(
        //     Env.DB_HOST
        // )}`;
        const dbAddr = `mongodb://${getFromEnv(Env.DB_HOST)}/reservationApp`;

        mongoose
            .connect(dbAddr, {
                serverSelectionTimeoutMS: 5000, // 5 sec
                socketTimeoutMS: 300000, // 5 min
            })
            .then(() => {
                winston.info('Connected to DB...');
                resolve();
            })
            .catch((err) => {
                winston.error(`Error connecting to db ${err}`);
                reject();
            });
    });
};

module.exports = setupDbConnection;
