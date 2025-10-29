const Listing = require('../models/listingModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

// @desc    Get all available listings (with search)
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i', // Case-insensitive
                },
              }
            : {};

        // Find listings that are 'Available' and match the keyword
        const listings = await Listing.find({ ...keyword, status: 'Available' }).populate(
            'seller',
            'name email'
        ).sort({ createdAt: -1 }); // Sort newest first

        res.status(200).json(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
    // 1. Destructure category from req.body
    const { title, description, expiryDate, latitude, longitude, category } = req.body;

    // --- Validation Checks ---
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
    }
    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Location is required' });
    }
    if (!category) { // Add check for category
        return res.status(400).json({ message: 'Please select a category' });
    }
    if (req.user.role !== 'Seller') {
        return res.status(403).json({ message: 'User is not a seller. Forbidden.' });
    }

    try {
        const listing = await Listing.create({
            title,
            description,
            expiryDate,
            imageUrl: req.file.path,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            seller: req.user.id,
            category, // 2. Add the category field here
        });

        // --- Notification Logic ---
        const seller = await User.findById(req.user.id);
        if (seller && seller.followers.length > 0) {
            const message = `${seller.name} just posted a new item: ${listing.title}`;
            const notifications = seller.followers.map(followerId => ({
                user: followerId,
                message: message,
                link: `/listing/${listing._id}`
            }));
            await Notification.insertMany(notifications);
            // In a real-time app, you'd emit a socket event here
        }
        // --- End Notification Logic ---

        res.status(201).json(listing);

    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(400).json({ message: 'Invalid data provided or server error', error: error.message });
    }
};

// @desc    Get a single listing by its ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate(
            'seller',
            'name email' // Populate seller details
        );
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json(listing);
    } catch (error) {
        console.error("Error fetching listing by ID:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Security check: Ensure the user deleting is the owner
        if (listing.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await listing.deleteOne();
        res.json({ message: 'Listing removed' });
    } catch (error) {
        console.error("Error deleting listing:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// ... (At the end of the file, before module.exports)

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Security check: Ensure the user updating is the owner
    if (listing.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // You can update any fields passed in the body
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body, // Pass the new data
      { new: true, runValidators: true } // Return the new doc & run schema validation
    );

    res.json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... (In your module.exports, add the new function name)
module.exports = {
  getListings,
  createListing,
  getListingById,
  deleteListing,
  updateListing, 
};