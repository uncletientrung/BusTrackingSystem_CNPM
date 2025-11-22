const express = require("express");
const router = express.Router();
const TrackingController = require('../Controllers/TrackinngController');

router.get('/:malt', TrackingController.getTrackingByIdLT)
router.put('/:malt', TrackingController.updateStatus)

module.exports = router;