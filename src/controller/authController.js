const winston = require('winston');

const { BadRequestException } = require('../exceptions');
const { mapUserEntityToUserView, mapUserEntityToPublicDto } = require('../mapper/userMapper');
const { login, refreshToken, registerUser } = require('../service/authService');
const { validateSaveUser } = require('./validator/userValidator');

/**
 * Login.
 */
const loginController = async (req, res) => {
    winston.debug('authController.login -- start');
    const userEntity = await login(res, req.body);
    winston.debug('authController.login -- success');
    return res.send(mapUserEntityToUserView(userEntity));
};

/**
 * Refresh token.
 */
const refreshTokenController = async (req, res) => {
    winston.debug('authController.refreshToken -- start');
    const userEntity = await refreshToken(res, req.header('x-refresh-token'));
    winston.debug('authController.refreshToken -- success');
    return res.send(mapUserEntityToUserView(userEntity));
};

/**
 * Register
 */
const registerController = async (req, res) => {
    const error = validateSaveUser(req.body);
    if (error) throw new BadRequestException(error);
    const user = await registerUser(res, req.body);
    return res.send(mapUserEntityToPublicDto(user));
};

module.exports = {
    loginController,
    registerController,
    refreshTokenController,
};
