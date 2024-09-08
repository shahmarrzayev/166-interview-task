const winston = require('winston');
const { ADMIN_DEFAULT_QUERY_LIMIT } = require('../../constants');

const getSortAndFilterParamsFromRequestQuery = (query) => {
    winston.debug('venueService.getSortAndFilterParamsFromRequestQuery -- start');
    if (!query) return null;

    const result = {};
    result.limit = query.limit ? parseInt(query.limit, 10) : ADMIN_DEFAULT_QUERY_LIMIT;
    result.page = query.page ? parseInt(query.page, 10) : 1;
    result.location = query.location ? query.location : null;
    return result;
};

module.exports = {
    getSortAndFilterParamsFromRequestQuery,
};
