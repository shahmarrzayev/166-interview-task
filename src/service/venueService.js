const winston = require('winston');
const hash = require('object-hash');
const { GeneralException } = require('../exceptions');
const {
    saveVenue,
    updateVenue,
    deleteVenue,
    findVenueById,
    findVenues,
    countVenues,
} = require('../repository/venueRepository');
const { mapVenueViewToVenueEntity } = require('../mapper/venueMapper');
const { getFromCache, setInCache } = require('../utils/cacheUtils');
const { getSortAndFilterParamsFromRequestQuery } = require('./helper/venueHelper');

const addVenue = async (venue, user) => {
    winston.debug('venueService.addVenue -- start');
    if (!venue) {
        winston.warn('venueService.addVenue -- null param');
        throw new GeneralException();
    }

    const venueEntity = mapVenueViewToVenueEntity(venue);
    venueEntity.createdBy = user.id;
    const savedVenueEntity = await saveVenue(venueEntity);
    if (!savedVenueEntity) {
        winston.error('venueService.addVenue -- could not save venue');
        throw new GeneralException();
    }
    winston.debug('venueService.addVenue -- success');
    return savedVenueEntity;
};

const getVenueById = async (id) => {
    winston.debug('venueService.getVenueById -- start');
    if (!id) {
        winston.warn('venueService.getVenueById -- null param');
        throw new GeneralException();
    }

    const venueEntity = await findVenueById(id);
    if (!venueEntity) {
        winston.error('venueService.getVenueById -- could not find venue');
        throw new GeneralException();
    }
    winston.debug('venueService.getVenueById -- success');
    return venueEntity;
};

const getManyVenues = async (requestQuery) => {
    winston.debug('venueService.getManyVenues -- start');
    if (!requestQuery) {
        winston.warn('venueService.getManyVenues -- null param');
        throw new GeneralException();
    }

    const filterOptions = await getSortAndFilterParamsFromRequestQuery(requestQuery);
    if (!filterOptions) {
        winston.error('venueService.getManyVenues -- could not get filter options');
        throw new GeneralException();
    }

    const queryHash = hash(filterOptions);
    let result = getFromCache(queryHash);
    if (result) return result;

    const { filter, venues } = (await findVenues(filterOptions)) || {};
    if (!venues) {
        winston.error('venueService.getManyVenues -- could not find venues');
        throw new GeneralException();
    }

    const totalNumberOfVenues = await countVenues(filter);

    result = {
        limit: filterOptions.limit,
        page: filterOptions.page,
        venues,
        total: totalNumberOfVenues,
    };
    setInCache(queryHash, result);
    winston.debug('venueService.getManyVenues -- success');
    return result;
};

const modifyVenue = async (id, venue) => {
    winston.debug('venueService.modifyVenue -- start');
    if (!id || !venue) {
        winston.warn('venueService.modifyVenue -- null param');
        throw new GeneralException();
    }

    const venueEntity = mapVenueViewToVenueEntity(venue);
    const updatedVenueEntity = await updateVenue(id, venueEntity);
    if (!updatedVenueEntity) {
        winston.error('venueService.modifyVenue -- could not update venue');
        throw new GeneralException();
    }
    winston.debug('venueService.modifyVenue -- success');
    return updatedVenueEntity;
};

const removeVenue = async (id) => {
    winston.debug('venueService.removeVenue -- start');
    if (!id) {
        winston.warn('venueService.removeVenue -- null param');
        throw new GeneralException();
    }

    const deletedVenue = await deleteVenue(id);
    if (!deletedVenue) {
        winston.error('venueService.removeVenue -- could not delete venue');
        throw new GeneralException();
    }
    winston.debug('venueService.removeVenue -- success');
    return deletedVenue;
};

module.exports = { addVenue, getVenueById, getManyVenues, modifyVenue, removeVenue };
