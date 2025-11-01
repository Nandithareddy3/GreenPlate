const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Listing = require('../models/listingModel');
const Claim = require('../models/claimModel');

// Helper function to generate a JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            followers: user.followers,
            following: user.following,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            followers: user.followers,
            following: user.following,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        let userActivity = {};
        if (user.role === 'Seller') {
            const listings = await Listing.find({ seller: user._id }).sort({ createdAt: -1 });
            userActivity = { listings };
        } else {
            const claims = await Claim.find({ taker: user._id }).populate('listing').sort({ createdAt: -1 });
            userActivity = { claims };
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            following: user.following, // <-- ⭐️ ADD THIS LINE
            followers: user.followers, // <-- ⭐️ ADD THIS LINE
            ...userActivity,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Follow / Unfollow a user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUser = async (req, res) => {
    try {
        const userToFollowId = req.params.id;
        const currentUserId = req.user.id;

        if (currentUserId === userToFollowId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const currentUser = await User.findById(currentUserId);
        const userToFollow = await User.findById(userToFollowId);

        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = currentUser.following.includes(userToFollowId);

        if (isFollowing) {
            await currentUser.updateOne({ $pull: { following: userToFollowId } });
            await userToFollow.updateOne({ $pull: { followers: currentUserId } });
            res.json({ message: 'User unfollowed' });
        } else {
            await currentUser.updateOne({ $push: { following: userToFollowId } });
            await userToFollow.updateOne({ $push: { followers: currentUserId } });
            res.json({ message: 'User followed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    followUser,
};