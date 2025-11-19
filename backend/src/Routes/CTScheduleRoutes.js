const express = require('express');
const router = express.Router();
const CTScheduleController = require('../Controllers/CTScheduleController');

router.get('/:malt', CTScheduleController.getAllById);

module.exports = router;