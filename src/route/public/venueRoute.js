const express = require('express');
const { UserRole } = require('../../enums');
const role = require('../../middleware/roleMw');
const { getVenueByIdController, getManyVenuesController } = require('../../controller/venueController');

const router = express.Router();

router.get('/', role(UserRole.USER), getManyVenuesController);
router.get('/:id', role(UserRole.USER), getVenueByIdController);

module.exports = router;
