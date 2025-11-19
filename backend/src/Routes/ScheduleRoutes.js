const express = require('express');
const router = express.Router();
const ScheduleController = require('../Controllers/ScheduleController');

router.get('/', ScheduleController.getAll);
router.post('/', ScheduleController.create)

module.exports = router;