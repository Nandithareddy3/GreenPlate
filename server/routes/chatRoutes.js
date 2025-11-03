const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
} = require('../controllers/chatController');

const { protect } = require('../middleware/authMiddleware');

// Get all of my conversations (Inbox)
router.get('/', protect, getConversations);

// Start a new conversation about a listing
// This REPLACES the old claim route
router.post('/:listingId', protect, startConversation);

// Get all messages for a specific conversation
router.get('/:id/messages', protect, getMessages);

// Send a new message
router.post('/:id/messages', protect, sendMessage);

module.exports = router;