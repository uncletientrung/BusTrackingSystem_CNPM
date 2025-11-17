const express = require('express');
const router = express.Router();
const StopController = require('../Controllers/StopControllers');

router.get('/', StopController.getAll);
router.get('/:id', StopController.getById);
router.post('/', StopController.create);

module.exports = router;