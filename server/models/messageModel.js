const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    // 'conversationId' links this message to a specific Conversation.
    // This is how we group all the text bubbles together.
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    
    // 'sender' is the ID of the user who wrote this message.
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    
    // 'message' is the actual text content of the message.
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // 'createdAt' tells us *when* the message was sent
);

module.exports = mongoose.model('Message', messageSchema);