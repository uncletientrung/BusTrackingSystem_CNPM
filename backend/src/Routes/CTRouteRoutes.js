const express = require('express');
const router = express.Router();
const CTRouteController = require('../Controllers/CTRouteController');

router.get('/', CTRouteController.getAll);
// Lấy chi tiết tuyến theo matd
router.get('/:matd', CTRouteController.getByMatd);

module.exports = router;