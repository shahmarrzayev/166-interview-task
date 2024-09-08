const Joi = require('joi');

const validateVenue = (body) => {
    if (!body) {
        return 'Invalid request';
    }
    const { error } = Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        capacity: Joi.number().required(),
        description: Joi.string().required(),
    }).validate(body);
    return error;
};

module.exports = { validateVenue };
