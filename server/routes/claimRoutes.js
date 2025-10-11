const express = require('express');
const router = express.Router();
const { createClaim } = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:listingId', protect, createClaim);

module.exports = router;