const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Listing = require('../models/listingModel');
const Claim = require('../models/claimModel');

// Helper Function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please include all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        // Fixed a small typo here as well
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
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        let userActivity = {};
        if (user.role === 'Seller') {
            // For sellers, find their listings
            const listings = await Listing.find({ seller: user._id }).sort({ createdAt: -1 });
            userActivity = { listings };
        } else {
            // For takers, find their claims
            const claims = await Claim.find({ taker: user._id }).populate('listing').sort({ createdAt: -1 });
            userActivity = { claims };
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            ...userActivity, // 2. Spread the relevant activity (listings or claims)
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};