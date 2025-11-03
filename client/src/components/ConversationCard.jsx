import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './ConversationCard.module.css';

const ConversationCard = ({ conversation }) => {
  const { user: currentUser } = useAuth(); // Get our own user info

  // 1. Find the "other user" in the chat
  // The 'participants' array has two users. We find the one that is NOT us.
  const otherUser = conversation.participants.find(
    (p) => p._id !== currentUser._id
  );

  if (!otherUser) {
    // This might be a group chat or an error, so we'll just skip it
    return null; 
  }

  // 2. Format the last message preview
  let lastMessagePreview = "No messages yet";
  if (conversation.lastMessage) {
    const sender = conversation.lastMessage.sender === currentUser._id ? "You: " : "";
    lastMessagePreview = `${sender}${conversation.lastMessage.message}`;
  }

  return (
    <Link to={`/chat/${conversation._id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img
          src={otherUser.profilePic || 'https://via.placeholder.com/50'}
          alt={otherUser.name}
          className={styles.avatar}
        />
        <div className={styles.content}>
          <h3 className={styles.name}>{otherUser.name}</h3>
          <p className={styles.messagePreview}>{lastMessagePreview}</p>
        </div>
      </div>
    </Link>
  );
};

export default ConversationCard;