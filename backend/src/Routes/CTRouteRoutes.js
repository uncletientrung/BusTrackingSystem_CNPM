const express = require('express');
const router = express.Router();
const CTRouteController = require('../Controllers/CTRouteController');

router.get('/', CTRouteController.getAll);
router.get('/:matd', CTRouteController.getByMatd);
router.put('/:matd', CTRouteController.updateStatus)

module.exports = router;