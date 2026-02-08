const express = require('express');
const router = express.Router();
const { recordPayment, getStudentFees, getPendingFees } = require('../controllers/feeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/payment', protect, authorize('admin'), recordPayment);
router.get('/student/:studentId', protect, getStudentFees);
router.get('/pending', protect, authorize('admin'), getPendingFees);

module.exports = router;
