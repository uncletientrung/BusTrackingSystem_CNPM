const express = require('express');
const router = express.Router();
const RouteController = require('../Controllers/RouteController');

router.get('/', RouteController.getAll);

module.exports = router;