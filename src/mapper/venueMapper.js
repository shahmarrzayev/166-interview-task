const { pick } = require('lodash');

const mapVenueEntityToVenueAdminView = (entity) => {
    return entity ? pick(entity, ['name', 'location', 'capacity', 'description', 'createdBy']) : null;
};

const mapVenueEntityToVenueView = (entity) => {
    return entity ? pick(entity, ['name', 'location', 'capacity', 'description']) : null;
};

const mapVenueViewToVenueEntity = (view) => {
    return view ? pick(view, ['name', 'location', 'capacity', 'description']) : null;
};

module.exports = { mapVenueEntityToVenueAdminView, mapVenueViewToVenueEntity, mapVenueEntityToVenueView };
