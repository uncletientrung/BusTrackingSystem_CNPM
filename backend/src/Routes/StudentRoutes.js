const express = require('express');
const router = express.Router();
const StudentController = require('../Controllers/StudentControllers');
router.get('/', StudentController.getAll);
router.get('/:mahs', StudentController.getById);
router.post('/', StudentController.create);
router.delete('/:mahs', StudentController.delete);
router.put('/:mahs', StudentController.update);
module.exports = router;