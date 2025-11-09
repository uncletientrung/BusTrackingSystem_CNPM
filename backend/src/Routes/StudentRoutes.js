const express = require('express');
const router = express.Router();
const StudentController = require('../Controllers/StudentControllers');
router.get('/', StudentController.getAll);

module.exports = router;