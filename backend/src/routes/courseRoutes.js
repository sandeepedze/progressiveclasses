const express = require('express');
const router = express.Router();
const { createCourse, getCourses } = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('admin'), createCourse);
router.get('/', protect, getCourses);

module.exports = router;
