const express = require('express');
const router = express.Router();
const RouteController = require('../Controllers/RouteController');

router.get('/', RouteController.getAll);
router.post('/', RouteController.create);
module.exports = router;