const express = require('express');
const router = express.Router();
const ScheduleController = require('../Controllers/ScheduleController');

router.get('/', ScheduleController.getAll);
router.post('/', ScheduleController.create);
router.delete('/:malt', ScheduleController.delete);
router.put('/:malt', ScheduleController.update)

module.exports = router;