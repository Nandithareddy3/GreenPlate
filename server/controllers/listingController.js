const Listing = require('../models/listingModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

// @desc    Get all available listings (with search)
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    // 1. Start with a base filter for 'Available' items
    let queryFilter = { status: 'Available' };

    // 2. Add keyword search (if provided)
    if (req.query.keyword) {
      queryFilter.title = {
        $regex: req.query.keyword,
        $options: 'i', // Case-insensitive
      };
    }

    // 3. Add category filter (if provided and not 'All')
    if (req.query.category && req.query.category !== 'All') {
      queryFilter.category = req.query.category;
    }
    
    // 4. Find all listings that match the combined filter
    const listings = await Listing.find(queryFilter)
      .populate('seller', 'name profilePic')
      .sort({ createdAt: -1 }); // Sort newest first

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
            seller.followers.forEach(followerId => {
        req.io.to(followerId.toString()).emit('new_notification', message);
      });
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
        'name email profilePic _id' // Add _id and profilePic
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

// @desc    Get listings near a specific location
// @route   GET /api/listings/nearme
// @access  Public
const getListingsNearMe = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  try {
    const listings = await Listing.find({
      status: 'Available',
      location: {
        $near: {
          // 1. $geometry is the standard for GeoJSON
          $geometry: {
            type: 'Point',
            coordinates: [userLon, userLat] // MongoDB uses [longitude, latitude]
          },
          // 2. $maxDistance: 10000 = 10 kilometers
          // Find listings within a 10km radius
          $maxDistance: 10000 
        }
      }
    }).populate('seller', 'name profilePic');

    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings near location:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Now, add the new function to your exports
module.exports = {
  getListings,
  createListing,
  getListingById,
  deleteListing,
  updateListing,
  getListingsNearMe 
};