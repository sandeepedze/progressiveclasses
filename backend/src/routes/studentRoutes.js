const express = require('express');
const router = express.Router();
const { registerStudent, getStudentsByInstitute, getStudentDetails } = require('../controllers/studentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', protect, authorize('admin'), registerStudent);
router.get('/institute/:instituteId', protect, authorize('admin', 'teacher'), getStudentsByInstitute);
router.get('/:id', protect, getStudentDetails);

module.exports = router;
