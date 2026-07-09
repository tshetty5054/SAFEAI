const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:userId', userController.getProfile);
router.put('/:userId', userController.updateProfile);

module.exports = router;
