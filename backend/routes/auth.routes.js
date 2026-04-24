const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { register, login, guestLogin, getMe, updateProfile, changePassword } = require('../controllers/auth.controller');
=======
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/auth.controller');
>>>>>>> c93f3bf6b7e410f6c3efdff9c53ce3ba77b7c3a2
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
<<<<<<< HEAD
router.post('/guest-login', guestLogin);
=======
>>>>>>> c93f3bf6b7e410f6c3efdff9c53ce3ba77b7c3a2
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
