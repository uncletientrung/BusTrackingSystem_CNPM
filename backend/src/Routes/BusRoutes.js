const express = require('express');
const router = express.Router();
const BusController = require('../Controllers/BusController');

router.get('/', BusController.getAll);
router.post('/',BusController.createBus);

module.exports = router;