const express = require('express');
const {
    registerController,
    loginController,
    refreshTokenController,
} = require('../../controller/authController');

const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/refresh', refreshTokenController);

module.exports = router;
