const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markNotificationsAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyNotifications);
router.put('/read', protect, markNotificationsAsRead);

module.exports = router;