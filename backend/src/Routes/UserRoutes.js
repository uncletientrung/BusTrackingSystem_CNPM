const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserControllers');
router.get('/', UserController.getAll);
router.post('/', UserController.create);


module.exports = router;