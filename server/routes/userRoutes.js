const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  followUser,
  getPublicUserProfile // 1. Import
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile); // This is for "My Profile"
router.put('/:id/follow', protect, followUser);

// 2. Add the new public route
router.get('/:id', getPublicUserProfile); // This is for "Other User's Profile"

module.exports = router;