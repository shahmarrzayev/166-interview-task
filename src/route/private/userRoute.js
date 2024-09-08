const express = require('express');

const { addUserController, getUserByIdController } = require('../../controller/userController');
const { UserRole } = require('../../enums');
const role = require('../../middleware/roleMw');

const router = express.Router();

router.get('/:id', role(UserRole.ADMIN), getUserByIdController);
router.post('/', role(UserRole.ADMIN), addUserController);

module.exports = router;
