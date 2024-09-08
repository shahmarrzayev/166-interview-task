const winston = require('winston');
const { BadRequestException } = require('../exceptions');
const { validateVenue } = require('./validator/venueValidator');
const { mapVenueEntityToVenueAdminView, mapVenueEntityToVenueView } = require('../mapper/venueMapper');
const { addVenue, getVenueById, getManyVenues, modifyVenue, removeVenue } = require('../service/venueService');

const addVenueController = async (req, res) => {
    winston.debug('venueController.addVenueController -- start');
    const { body, user } = req;
    const error = validateVenue(body);
    if (error) {
        winston.error(`venueController.addVenueController -- ${JSON.stringify(error)}`);
        throw new BadRequestException(error);
    }
    const venue = await addVenue(body, user);
    winston.debug('venueController.addVenueController -- success');
    return res.send(mapVenueEntityToVenueAdminView(venue));
};

const getVenueByIdController = async (req, res) => {
    winston.debug('venueController.getVenueByIdController -- start');
    const { params } = req;
    const venue = await getVenueById(params.id);
    winston.debug('venueController.getVenueByIdController -- success');
    return res.send(mapVenueEntityToVenueView(venue));
};

const getManyVenuesController = async (req, res) => {
    winston.debug('venueController.getManyVenuesController -- start');
    const { query } = req;
    const result = await getManyVenues(query);
    result.venues = result.venues.map((venue) => mapVenueEntityToVenueView(venue));
    winston.debug('venueController.getManyVenuesController -- success');
    return res.send(result);
};

const modifyVenueController = async (req, res) => {
    winston.debug('venueController.modifyVenueController -- start');
    const { body, params } = req;
    const error = validateVenue(body);
    if (error) {
        winston.error(`venueController.modifyVenueController -- ${JSON.stringify(error)}`);
        throw new BadRequestException(error);
    }
    const venue = await modifyVenue(params.id, body);
    winston.debug('venueController.modifyVenueController -- success');
    return res.send(mapVenueEntityToVenueAdminView(venue));
};

const removeVenueController = async (req, res) => {
    winston.debug('venueController.removeVenueController -- start');
    const { params } = req;
    const venue = await removeVenue(params.id);
    winston.debug('venueController.removeVenueController -- success');
    return res.send(mapVenueEntityToVenueAdminView(venue));
};

module.exports = {
    addVenueController,
    getVenueByIdController,
    getManyVenuesController,
    modifyVenueController,
    removeVenueController,
};
