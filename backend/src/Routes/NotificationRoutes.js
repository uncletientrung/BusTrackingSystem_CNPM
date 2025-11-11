const express = require('express');
const router = express.Router();
const NotificationController = require('../Controllers/NotificationController');

router.get('/', NotificationController.getAll);

module.exports = router;