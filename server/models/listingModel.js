const mongoose = require('mongoose');

// Define the GeoJSON schema for location separately for clarity
const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
    }
}, { _id: false }); // Prevent Mongoose from creating an _id for this subdocument

const listingSchema = new mongoose.Schema(
    {
        // ✅ Corrected: Seller should be an ObjectId reference
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        imageUrl: {
            type: String,
            required: [true, 'Please add an image'],
        },
        expiryDate: {
            type: Date,
            required: [true, 'Please add an expiry date'],
        },
        // ✅ ADDED: The new category field
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: [
                'Bakery & Breads',
                'Fresh Produce',
                'Dairy & Eggs',
                'Cooked Meals',
                'Packaged Goods',
                'Desserts & Sweets',
                'Other'
            ]
        },
        // ✅ UPDATED: Using the separate locationSchema and inline index
        location: {
            type: locationSchema,
            required: true,
            index: '2dsphere' // Create the geospatial index here
        },
        status: {
            type: String,
            required: true,
            enum: ['Available', 'Claimed', 'Expired'],
            default: 'Available',
            enum: ['Available', 'Claimed', 'Expired'], // Assuming 'Claimed' is still needed for inquiries/management
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Note: The index definition is now inside the schema definition for location

module.exports = mongoose.model('Listing', listingSchema);
