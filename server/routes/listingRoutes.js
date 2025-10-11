const express = require('express');
const router = express.Router();
const { createListing,
    getListings,
    getListingById,
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
router.get('/', getListings);
router.post('/', protect, createListing);
router.get('/:id', getListingById);
module.exports = router;