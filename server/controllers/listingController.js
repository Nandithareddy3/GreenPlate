const Listing = require('../models/listingModel');
//POST /api/listings
const createListing = async (req, res) => {
    const { title, description, expiryDate } = req.body;

    if (req.user.role !== 'Seller') {
        return res.status(403).json({ message: 'User is not a seller. Forbidden.' });
    }
    const listing = await Listing.create({
        title,
        description,
        expiryDate,
        seller: req.user.id,
    });
    res.status(201).json(listing);
};
// GET /api/listings
const getListings = async (req, res) => {
    const listings = await Listing.find({ status: 'Available' }).populate(
        'seller',
        'name email'
    );

    res.status(200).json(listings);
};
// @route   GET /api/listings/:id
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate(
            'seller',
            'name email'
        );

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
module.exports = {
    getListings,
    createListing,
    getListingById,
};