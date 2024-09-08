const winston = require('winston');

const { UnauthorizedException, GeneralException, ConflictException } = require('../exceptions');
const {
    generateToken,
    setAuthHeaders,
    verifyPassword,
    verifyRefreshToken,
    hashPassword,
} = require('./helper/authHelper');
const {
    findUserByEmail,
    findUserById,
    saveUser,
    findUserByEmailOrUsername,
} = require('../repository/userRepository');
const { mapSaveUserToEntity } = require('../mapper/userMapper');

/**
 * @private
 * Verify user password and generate tokens.
 * @param {UserEntity} entity
 * @param {String} password
 * @returns {Promise<{ accessToken: String, refreshToken: String }>}
 */
const verifyUser = async (entity, password) => {
    const passwordIsCorrect = await verifyPassword(entity.password, password);
    if (!passwordIsCorrect) {
        winston.warn('authService.login -- wrong password');
        throw new UnauthorizedException('Yalnış istifadəçi adı və ya şifrə');
    }

    const accessToken = entity.mobilePhone
        ? generateToken(entity._id, entity.mobilePhone)
        : generateToken(entity._id, entity.email);
    const refreshToken = entity.mobilePhone
        ? generateToken(entity._id, entity.mobilePhone, true)
        : generateToken(entity._id, entity.email, true);
    if (!accessToken || !refreshToken) {
        winston.warn(
            `authService.login -- couldn't generate token: ${accessToken}, ${refreshToken}`
        );
        throw new GeneralException();
    }

    return { accessToken, refreshToken };
};

/**
 * Login user.
 * @param {Response} res
 * @param {LoginView} loginView
 * @returns {Promise<UserEntity>}
 */
const login = async (res, loginView) => {
    winston.debug('authService.login -- start');
    if (!res || !loginView || !loginView.email || !loginView.password) {
        winston.warn(`authService.login -- null param: ${res}, ${loginView}`);
        throw new GeneralException();
    }

    const { email, password } = loginView;

    const userEntity = await findUserByEmail(email);
    if (!userEntity) {
        winston.warn('authService.login -- user not found');
        throw new UnauthorizedException('Yalnış istifadəçi adı və ya şifrə');
    }

    const { accessToken, refreshToken } = (await verifyUser(userEntity, password)) || {};

    const headersAreSet = setAuthHeaders(res, accessToken, refreshToken);
    if (!headersAreSet) {
        winston.warn('authService.login -- couldn not set headers');
        throw new GeneralException();
    }
    winston.debug('authService.login -- success');
    return userEntity;
};

/**
 * Refresh token.
 * @param {Response} res
 * @param {String} token
 * @returns {Promise<UserEntity>} userEntity
 */
const refreshToken = async (res, token) => {
    winston.debug('authService.refreshToken -- start');
    if (!res || !token) {
        winston.warn(`authService.refreshToken -- null param: ${res}, ${token}`);
        throw new UnauthorizedException('Token is missing');
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded || !decoded.data || !decoded.data.id || !decoded.data.email) {
        winston.warn('authService.refreshToken -- invalid refresh token');
        throw new UnauthorizedException('Yenidən daxil olun');
    }
    const { id, email } = decoded.data;

    const user = await findUserById(id);
    if (!user) {
        winston.warn('authService.refreshToken -- user not found');
        throw new UnauthorizedException('Yenidən daxil olun');
    }

    const accessToken = generateToken(id, email);
    if (!accessToken) {
        winston.warn(`authService.refreshToken -- couldn't generate token`);
        throw new GeneralException();
    }

    const headersAreSet = setAuthHeaders(res, accessToken, token);
    if (!headersAreSet) {
        winston.warn('authService.refreshToken -- could not set headers');
        throw new GeneralException();
    }
    winston.debug('authService.refreshToken -- success');
    return user;
};

/**
 * Register user
 * @param {Response} res
 * @param {UserView} user
 * @returns {Promise<UserEntity>} userEntity
 */
const registerUser = async (res, user) => {
    winston.debug('authService.registerUser -- start');
    if (!user) {
        winston.warn('authService.registerUser -- invalid arg');
        throw new GeneralException();
    }

    const userExists = await findUserByEmailOrUsername(user.email, user.username);
    if (userExists) {
        winston.debug('authService.registerUser -- customer exists');
        throw new ConflictException('İstifadəçi mövcüddur');
    }

    let entity = mapSaveUserToEntity(user);
    entity.password = await hashPassword(user.password);
    if (!entity.password) {
        winston.warn('authService.registerUser -- could not hash password');
        throw new GeneralException();
    }

    entity = await saveUser(entity);
    if (!entity) {
        winston.warn('authService.registerUser -- could not save');
        throw new GeneralException();
    }

    // Set auth header
    const xaccessToken = generateToken(entity._id, entity.email);
    const xrefreshToken = generateToken(entity._id, entity.email, true);

    if (!xaccessToken || !xrefreshToken) {
        winston.warn(
            `authService.registerUser -- couldn't generate token: ${xaccessToken}, ${xrefreshToken}`
        );
        throw new GeneralException();
    }

    const headersAreSet = setAuthHeaders(res, xaccessToken, xrefreshToken);
    if (!headersAreSet) {
        winston.warn('authService.registerUser -- could not set headers');
        throw new GeneralException();
    }

    winston.debug('authService.registerUser -- success');
    return entity;
};

module.exports = {
    login,
    refreshToken,
    registerUser,
};
