const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/', alertController.getAlerts);
router.post('/', alertController.createAlert);
router.put('/:id', alertController.updateAlertStatus);
router.get('/stats/admin', alertController.getAdminStats);

module.exports = router;
