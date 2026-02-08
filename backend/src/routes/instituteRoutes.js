const express = require('express');
const router = express.Router();
const { createInstitute, getInstitutes, updateInstitute } = require('../controllers/instituteController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('admin'), createInstitute);
router.get('/', protect, authorize('admin'), getInstitutes);
router.put('/:id', protect, authorize('admin'), updateInstitute);

module.exports = router;
