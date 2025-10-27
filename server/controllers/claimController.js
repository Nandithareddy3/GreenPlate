const Claim = require('../models/claimModel');
const Listing = require('../models/listingModel');
const User = require('../models/userModel');
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

// @route   GET /api/claims/myclaims
const getMyClaims = async (req, res) => {
    const claims = await Claim.find({ taker: req.user.id }).populate('listing');
    res.status(200).json(claims);
};
// @route   GET /api/claims/received
const getReceivedClaims = async (req, res) => {
    const claims = await Claim.find({ seller: req.user.id }).populate('listing').populate('taker', 'name');
    res.status(200).json(claims);
};

// @route   PUT /api/claims/:claimId
const updateClaimStatus = async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    const claim = await Claim.findById(req.params.claimId);

    if (!claim) {
        return res.status(404).json({ message: 'Claim not found' });
    }
    if (claim.seller.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }
    claim.status = status;
    await claim.save();
    if (status === 'Cancelled') {
        await Listing.findByIdAndUpdate(claim.listing, { status: 'Available' });
    }

    res.status(200).json(claim);
};
module.exports = {
    createClaim,
    getMyClaims,
    getReceivedClaims,
    updateClaimStatus,
};