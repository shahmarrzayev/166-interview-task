const winston = require('winston');
const Venue = require('./models/venueModel');
const { runQuery, getPaginationDetails } = require('./helper/repositoryHelper');

const countVenues = async (filter) => {
    winston.debug('venueRepository.countVenues -- start');
    if (!filter) {
        winston.warn('venueRepository.countVenues -- null param');
        return null;
    }
    const count = await runQuery(() => Venue.countDocuments(filter));
    winston.debug('venueRepository.countVenues -- success');
    return count;
};

const findVenueById = async (id) => {
    winston.debug('venueRepository.findVenueById -- start');
    if (!id) {
        winston.warn('venueRepository.findVenueById -- null param');
        return null;
    }
    const venue = await runQuery(() => Venue.findById(id));
    winston.debug('venueRepository.findVenueById -- success');
    return venue;
};

const findVenues = async (queryDetails) => {
    winston.debug('venueRepository.findVenues -- start');
    const { limit, skip } = getPaginationDetails(queryDetails) || {};
    const filter = {};
    if (queryDetails.location) filter.location = queryDetails.location;
    const venues = await runQuery(() => Venue.find(filter).skip(skip).limit(limit));
    winston.debug('venueRepository.findVenues -- success');
    return { filter, venues };
};

const deleteVenue = async (id, transaction) => {
    winston.debug('venueRepository.deleteVenue -- start');
    if (!id) {
        winston.warn('venueRepository.deleteVenue -- null param');
        return null;
    }
    const deletedVenue = await runQuery(() => Venue.findByIdAndDelete(id).session(transaction));
    winston.debug('venueRepository.deleteVenue -- success');
    return deletedVenue;
};

const saveVenue = async (venue, transaction) => {
    winston.debug('venueRepository.saveVenue -- start');
    if (!venue) {
        winston.warn('venueRepository.saveVenue -- null param');
        return null;
    }
    const dbVenue = new Venue(venue);
    const savedVenue = await runQuery(() => dbVenue.save({ session: transaction }));
    winston.debug('venueRepository.saveVenue -- success');
    return savedVenue;
};

const updateVenue = async (id, venue, transaction) => {
    winston.debug('venueRepository.updateVenue -- start');
    if (!id || !venue) {
        winston.warn(`venueRepository.updateVenue -- null param: ${id} ${venue}`);
        return null;
    }
    const modifiedVenue = await runQuery(() => Venue.findByIdAndUpdate(id, venue, { new: true, session: transaction }));
    winston.debug('venueRepository.updateVenue -- success');
    return modifiedVenue;
};

module.exports = {
    countVenues,
    findVenueById,
    findVenues,
    deleteVenue,
    saveVenue,
    updateVenue,
};
