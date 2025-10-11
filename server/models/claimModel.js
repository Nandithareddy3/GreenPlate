const mongoose = require('mongoose');

const claimSchema = mongoose.Schema(
    {
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Listing',
        },
        taker: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Claim', claimSchema);