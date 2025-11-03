const express = require('express');
const router = express.Router();
const { createListing,
    getListings,
    getListingById,
    deleteListing,
    updateListing,
    getListingsNearMe,
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getListings);
router.get('/nearme', getListingsNearMe);
router.get('/:id', getListingById);
router.delete('/:id', protect, deleteListing);
router.post('/', protect, upload.single('image'), createListing);
router.put('/:id', protect, updateListing);
module.exports = router;