const jwt = require('jsonwebtoken');
const winston = require('winston');

const { Env, UserRole } = require('../enums');
const { BadRequestException, UnauthorizedException, ForbiddenException } = require('../exceptions');
const { getUserById } = require('../service/userService');
const { getFromEnv } = require('../utils/commonUtils');

const authenticateUser = async (req) => {
    const token = req.get('x-access-token');
    if (!token) {
        winston.warn('roleMW -- no token provided');
        throw new BadRequestException('Daxil olun');
    }

    try {
        const decoded = jwt.verify(token, getFromEnv(Env.ACCESS_TOKEN_SIGNATURE));
        const { id } = decoded.data;

        const user = await getUserById(id, true);
        if (!user) {
            winston.warn('roleMW -- user does not exist');
            throw new UnauthorizedException('Not authorized');
        }
        return user;
    } catch (error) {
        winston.debug(`roleMW -- ${JSON.stringify(error)}`);
        throw new UnauthorizedException('Yenidən daxil olun');
    }
};

const checkUserRole = async (user, role) => {
    const userRole = user.role;
    if (!userRole) {
        winston.warn('roleMw -- user not authorized');
        throw new UnauthorizedException('Not authorized');
    }

    if (userRole !== role && userRole !== UserRole.ADMIN) {
        winston.warn('roleMW -- user not authorized');
        throw new ForbiddenException('Not authorized');
    }
};

module.exports = (role) => {
    return async (req, res, next) => {
        const user = await authenticateUser(req);
        await checkUserRole(user, role);
        req.user = user;
        next();
    };
};
