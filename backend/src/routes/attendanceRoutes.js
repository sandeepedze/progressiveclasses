const express = require('express');
const router = express.Router();
const { markAttendance, getBatchAttendance, getStudentAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('admin', 'teacher'), markAttendance);
router.get('/batch', protect, authorize('admin', 'teacher'), getBatchAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);

module.exports = router;
