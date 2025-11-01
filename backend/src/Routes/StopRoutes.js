const express = require('express');
const router = express.Router();
const StopController = require('../controllers/StopController');

router.get('/', StopController.getAll);
router.get('/:id', StopController.getById);

module.exports = router;