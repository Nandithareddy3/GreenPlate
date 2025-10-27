const express = require('express');
const router = express.Router();
const {
    createClaim,
    getMyClaims,
    getReceivedClaims,
    updateClaimStatus
} = require('../controllers/claimController');

const { protect } = require('../middleware/authMiddleware');

router.get('/myclaims', protect, getMyClaims);
router.get('/received', protect, getReceivedClaims);
router.post('/:listingId', protect, createClaim);
router.put('/:claimId', protect, updateClaimStatus);

module.exports = router;