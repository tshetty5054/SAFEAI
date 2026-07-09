const express = require('express');
const router = express.Router();
const unsafeZoneController = require('../controllers/unsafeZoneController');

router.get('/', unsafeZoneController.getUnsafeZones);
router.post('/', unsafeZoneController.createUnsafeZone);
router.delete('/:id', unsafeZoneController.deleteUnsafeZone);

module.exports = router;
