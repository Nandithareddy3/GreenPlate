const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const Listing = require('../models/listingModel');

// --- 1. GET ALL CONVERSATIONS (Your "Inbox") ---
// @desc    Get all of the current user's conversations
// @route   GET /api/chat
// @access  Private
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ 
      participants: req.user.id 
    })
    .populate('participants', 'name profilePic') // Get user info
    .populate('lastMessage') // Get the last message text
    .sort({ updatedAt: -1 }); // Show most recent chats first

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- 2. GET ALL MESSAGES (A Single Chat Window) ---
// @desc    Get all messages for one conversation
// @route   GET /api/chat/:id/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ 
      conversationId: req.params.id 
    })
    .populate('sender', 'name profilePic') // Get the sender's info
    .sort({ createdAt: 'asc' }); // Show oldest messages first

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- 3. SEND A MESSAGE ---
// @desc    Create a new message in a conversation
// @route   POST /api/chat/:id/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { message } = req.body;
  const conversationId = req.params.id;
  const senderId = req.user.id;

  try {
    // 1. Create the new message (use 'let' not 'const')
    let newMessage = await Message.create({
      conversationId,
      sender: senderId,
      message,
    });

    // 2. Update the conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage._id,
    });
    
    // --- ⭐️ START OF FIX ⭐️ ---
    // 3. We must populate the 'sender' field
    newMessage = await newMessage.populate('sender', 'name profilePic');
    // --- ⭐️ END OF FIX ⭐️ ---

    // 4. Find the receiver
    const conversation = await Conversation.findById(conversationId);
    const receiver = conversation.participants.find(
      (participant) => participant.toString() !== senderId
    );

    if (receiver) {
      // 5. Emit the *populated* message
      req.io.to(receiver.toString()).emit('new_message', newMessage);
    }

    // 6. Respond with the populated message
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- 4. START A CONVERSATION (The "I'm Interested!" Button) ---
// @desc    Find or create a new conversation about a listing
// @route   POST /api/chat/:listingId
// @access  Private
const startConversation = async (req, res) => {
  const { listingId } = req.params;
  const takerId = req.user.id;

  try {
    // 1. Find the listing to get the seller's ID
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    const sellerId = listing.seller;

    // 2. Check if a conversation between these two users already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [takerId, sellerId] },
    });

    // 3. If no chat exists, create one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [takerId, sellerId],
      });
    }

    // 4. (Optional) Send an initial "system" message
    // This is better than the old "claim" system.
    // The Taker's first message will be about the item.
    const initialMessage = await Message.create({
      conversationId: conversation._id,
      sender: takerId,
      message: `Hi! I'm interested in your listing: "${listing.title}"`
    });
    
    // 5. Update the conversation's last message
    conversation.lastMessage = initialMessage._id;
    await conversation.save();

    // 6. Send the new conversation (and message) to the Seller in real-time
    req.io.to(sellerId.toString()).emit('new_message', initialMessage);

    // 7. Send the new conversationId back to the Taker
    // The frontend will then redirect to the chat page
    res.status(201).json({ conversationId: conversation._id });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
};