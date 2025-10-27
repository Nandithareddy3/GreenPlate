// server/controllers/storyController.js
const Story = require('../models/storyModel');
const User = require('../models/userModel');

// @desc    Create a new story
// @route   POST /api/stories
// @access  Private
const createStory = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
    }

    const story = await Story.create({
        user: req.user.id,
        imageUrl: req.file.path,
        caption: req.body.caption,
    });

    res.status(201).json(story);
};
// @route   GET /api/stories

const getStories = async (req, res) => {
    const currentUser = await User.findById(req.user.id);
    const followingIds = currentUser.following;
    followingIds.push(req.user.id);

    const stories = await Story.find({ user: { $in: followingIds } })
        .populate('user', 'name')
        .sort({ createdAt: -1 });

    res.json(stories);
};

module.exports = { createStory, getStories };