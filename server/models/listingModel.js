const mongoose = require('mongoose');
const listingSchema = mongoose.Schema(
    {

        seller: {
            type: String, required: true, ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'please add a title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        expiryDate: {
            type: Date,
            required: [true, 'Please add an expiry date'],
        },
        status: {
            type: String,
            required: true,
            enum: ['Available', 'Claimed', 'Expired'],
            default: 'Available',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Listing', listingSchema);
