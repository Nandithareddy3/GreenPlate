const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, followUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/:id/follow', protect, followUser);
module.exports = router;