const express = require('express');
const router = express.Router();
const RouteController = require('../Controllers/RouteController');

router.get('/', RouteController.getAll);
router.post('/', RouteController.create);
router.delete('/:matd', RouteController.delete);
router.put('/:matd', RouteController.update);
module.exports = router;