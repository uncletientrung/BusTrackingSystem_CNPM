const express = require('express');
const router = express.Router();
const AccountController = require('../Controllers/AccountControllers');

router.get('/', AccountController.getAll);
router.get('/:id', AccountController.getById);
router.put('/:id', AccountController.update);

module.exports = router;