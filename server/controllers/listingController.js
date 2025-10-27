const Listing = require('../models/listingModel');
//POST /api/listings
const createListing = async (req, res) => {
    const { title, description, expiryDate, latitude, longitude } = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
    }
    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Location is required' });
    }
    if (req.user.role !== 'Seller') {
        return res.status(403).json({ message: 'User is not a seller. Forbidden.' });
        const listing = await Listing.create({
            title,
            description,
            expiryDate,
            imageUrl: req.file.path,
            // 2. Save location in GeoJSON format. IMPORTANT: It must be [longitude, latitude]
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            seller: req.user.id,
        });

        res.status(201).json(listing);
    };
};
// GET /api/listings
// @access  Public
const getListings = async (req, res) => {
    // 1. Create a keyword filter
    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword, // Search for the keyword in the title
                $options: 'i', // 'i' makes it case-insensitive
            },
        }
        : {};

    // 2. Find listings matching the keyword AND that are 'Available'
    const listings = await Listing.find({ ...keyword, status: 'Available' }).populate(
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