const Joi = require('joi');

const validateAddProductToCart = (productInfo) => {
    if (!productInfo) {
        return 'Invalid request';
    }
    const { error } = Joi.object({
        count: Joi.number().min(1),
        productId: Joi.string().required(),
    }).validate(productInfo);
    if (error) {
        return error.details && error.details.length ? error.details[0].message : 'Invalid request';
    }
    return null;
};

const validateSaveUser = (user) => {
    if (!user) {
        return 'Invalid request';
    }
    const { error } = Joi.object({
        username: Joi.string().min(1).max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).validate(user);
    if (error) {
        return error.details && error.details.length ? error.details[0].message : 'Invalid request';
    }
    return null;
};

const validateChangePassword = (oldPassword, newPassword) => {
    if (!oldPassword || !newPassword) {
        return 'Invalid request';
    }
    return null;
};

module.exports = {
    validateAddProductToCart,
    validateSaveUser,
    validateChangePassword,
};
