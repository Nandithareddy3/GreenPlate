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

  // --- ⭐️ START OF NEW NOTIFICATION LOGIC ⭐️ ---
  try {
    const seller = await User.findById(req.user.id);
    if (seller && seller.followers.length > 0) {
      const message = `${seller.name} posted a new story.`;
      
      const notifications = seller.followers.map(followerId => ({
        user: followerId, // The follower who gets the notification
        message: message,
        link: `/` // Link to the homepage to see the story
      }));

      await Notification.insertMany(notifications);
      seller.followers.forEach(followerId => {
        req.io.to(followerId.toString()).emit('new_notification', message);
      });
      // We can also send a real-time socket event here
      // req.io.to(seller.followers.map(id => id.toString())).emit('new_notification', message);
    }
  } catch (error) {
    console.error('Error creating story notifications:', error);
  }
  // --- ⭐️ END OF NEW NOTIFICATION LOGIC ⭐️ ---

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