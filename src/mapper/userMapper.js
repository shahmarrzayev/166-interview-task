const { pick } = require('lodash');

const mapUserEntityToUserView = (entity) => {
    if (!entity) return null;
    const userView = pick(entity, ['email', 'firstName', 'lastName', 'patronymic', 'cart']);
    userView.id = entity._id;

    return userView;
};

const mapUserEntityToPublicDto = (entity) => {
    if (!entity) return null;
    const dto = pick(entity, ['_id', 'username', 'email']);
    return dto;
};

const mapSaveUserToEntity = (saveDto) => {
    if (!saveDto) return null;
    return pick(saveDto, ['username', 'email', 'password']);
};

module.exports = {
    mapUserEntityToUserView,
    mapSaveUserToEntity,
    mapUserEntityToPublicDto,
};
