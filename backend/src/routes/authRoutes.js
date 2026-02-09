const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController');
const { getEduTypes, setupOrganization } = require('../controllers/organizationController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Onboarding Routes
router.get('/edu-types', protect, getEduTypes);
router.post('/setup-org', protect, setupOrganization);

module.exports = router;
