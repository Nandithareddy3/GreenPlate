const express = require('express');
const router = express.Router();
const { createStory, getStories } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('storyImage'), createStory);

router.get('/', protect, getStories);

module.exports = router;