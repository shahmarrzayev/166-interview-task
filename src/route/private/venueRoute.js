const express = require('express');
const role = require('../../middleware/roleMw');
const { UserRole } = require('../../enums');
const {
    addVenueController,
    modifyVenueController,
    removeVenueController,
} = require('../../controller/venueController');

const router = express.Router();

router.post('/', role(UserRole.ADMIN), addVenueController);
router.put('/:id', role(UserRole.ADMIN), modifyVenueController);
router.delete('/:id', role(UserRole.ADMIN), removeVenueController);

module.exports = router;
