const express = require('express');
const router = express.Router();
const StudentController = require('../Controllers/StudentControllers');
router.get('/', StudentController.getAll);
router.post('/', StudentController.create);
module.exports = router;