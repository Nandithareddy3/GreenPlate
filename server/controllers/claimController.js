const Claim = require('../models/claimModel');
const Listing = require('../models/listingModel');
// @route   POST /api/claims/:listingId

const createClaim = async (req, res) => {
    const listing = await Listing.findById(req.params.listingId);

    if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.status !== 'Available') {
        return res.status(400).json({ message: 'This listing is no longer available' });
    }


    const claim = await Claim.create({
        listing: listing._id,
        taker: req.user.id,
        seller: listing.seller,
    });

    listing.status = 'Claimed';
    await listing.save();

    res.status(201).json(claim);
};

module.exports = { createClaim };