const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { getEduTypes, setupOrganization } = require('../controllers/organizationController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);

// Onboarding Routes
router.get('/edu-types', protect, getEduTypes);
router.post('/setup-org', protect, setupOrganization);

module.exports = router;
