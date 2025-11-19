const express = require('express');
const router = express.Router();
const NotificationController = require('../Controllers/NotificationController');

router.get('/', NotificationController.getAll);
router.post('/', NotificationController.create);
router.delete('/:matb', NotificationController.delete);
router.put('/:matb', NotificationController.update);

module.exports = router;