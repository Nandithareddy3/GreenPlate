
const mongoose = require('mongoose');

const storySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    imageUrl: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        trim: true,
        maxlength: 200
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
}, { timestamps: false });

const Story = mongoose.model('Story', storySchema);
module.exports = Story;