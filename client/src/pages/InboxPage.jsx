import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ConversationCard from '../components/ConversationCard.jsx';
import styles from './InboxPage.module.css';

const InboxPage = () => {
  const { API } = useAuth(); // Get our special API instance
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        // 1. Call the API route we built to get our inbox
        const { data } = await API.get('/api/chat');
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [API]); // Re-run if API instance changes

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Inbox</h1>
      
      <div className={styles.feed}>
        {loading ? (
          <p className={styles.emptyMessage}>Loading conversations...</p>
        ) : conversations.length > 0 ? (
          conversations.map((convo) => (
            <ConversationCard key={convo._id} conversation={convo} />
          ))
        ) : (
          <p className={styles.emptyMessage}>You have no messages yet.</p>
        )}
      </div>
    </div>
  );
};

export default InboxPage;