const express = require('express');
const router = express.Router();
const { getRecruiterDashboard, searchCandidates } = require('../controllers/recruiter.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/dashboard', protect, authorize('recruiter', 'admin'), getRecruiterDashboard);
router.get('/candidates', protect, authorize('recruiter', 'admin'), searchCandidates);

module.exports = router;
