const express = require('express');
const router = express.Router();
const BusController = require('../Controllers/BusController');

router.get('/', BusController.getAll);
router.post('/', BusController.createBus);
router.delete('/:maxe', BusController.deleteBus);
router.put('/:maxe', BusController.updateBus);

module.exports = router;