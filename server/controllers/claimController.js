const Claim = require('../models/claimModel');
const Listing = require('../models/listingModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

// @route   POST /api/claims/:listingId

const createClaim = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId).populate('seller');

    if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
    }
    if (!listing.seller) {
      console.error(`Orphaned Listing Found: Listing ${listing._id} has no valid seller.`);
      return res.status(404).json({ message: 'The seller for this listing could not be found.' });
    }
    const existingClaim = await Claim.findOne({ listing: listing._id, taker: req.user.id });
    if (existingClaim) {
        return res.status(400).json({ message: 'You have already sent an inquiry for this item.' });
    }
    const claim = await Claim.create({
        listing: listing._id,
        taker: req.user.id,
        seller: listing.seller._id,
    });
    const message = `${req.user.name} is interested in your item: ${listing.title}`;
    await Notification.create({
        user: listing.seller._id,
        message: message,
        link: `/profile`
    });
req.io.to(listing.seller._id.toString()).emit('new_notification', message);
    res.status(201).json(claim);
} catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ message: 'Server Error' });
  }
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

    if (!['Confirmed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status update' });
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

    res.status(200).json(claim);
};
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // **CRITICAL SECURITY CHECK**: Ensure the user deleting is the owner
        if (listing.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await listing.deleteOne();
        res.json({ message: 'Listing removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createClaim,
    getMyClaims,
    deleteListing,
    getReceivedClaims,
    updateClaimStatus,
};