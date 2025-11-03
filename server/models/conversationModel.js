const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    // 'participants' is an array of User IDs.
    // This will hold the Taker's ID and the Seller's ID.
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to our 'User' model
      },
    ],
    
    // 'lastMessage' stores the ID of the very last message sent
    // This helps us sort our "Inbox" page later.
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
  },
  { timestamps: true } // Adds 'createdAt' and 'updatedAt'
);

module.exports = mongoose.model('Conversation', conversationSchema);