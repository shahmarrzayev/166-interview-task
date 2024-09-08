const Cache = Object.freeze({
    ROLE: 'ROLE',
    USER: 'USER',
});

const Env = Object.freeze({
    PORT: 'PORT',
    NODE_ENV: 'NODE_ENV',

    ACCESS_TOKEN_EXPIRE: 'ACCESS_TOKEN_EXPIRE',
    ACCESS_TOKEN_SIGNATURE: 'ACCESS_TOKEN_SIGNATURE',

    DB_HOST: 'DB_HOST',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_USER: 'DB_USER',

    REFRESH_TOKEN_EXPIRE: 'REFRESH_TOKEN_EXPIRE',
    REFRESH_TOKEN_SIGNATURE: 'REFRESH_TOKEN_SIGNATURE',
});

const UserRole = Object.freeze({
    ADMIN: 'ADMIN',
    USER: 'USER',
});

module.exports = {
    Cache,
    Env,
    UserRole,
};
