import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { io } from 'socket.io-client';
import { BiArrowBack, BiSend } from 'react-icons/bi';
import styles from './ChatPage.module.css';

// 1. Connect to the socket server
const socket = io('http://localhost:5000');

const ChatPage = () => {
  const { id: conversationId } = useParams(); // Get conversation ID from URL
  const { user, API } = useAuth(); // Get current user and API
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // This ref will point to the bottom of the chat window
  const messagesEndRef = useRef(null);

  // Helper to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 2. Fetch all messages when the page loads
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/api/chat/${conversationId}/messages`);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId, API]);

  // 3. Set up Socket.IO listeners for real-time messages
  useEffect(() => {
    if (!user) return;

    // Join the room for this specific user
    socket.emit('join_room', user._id);
    
    // Listen for the 'new_message' event
    const handleNewMessage = (message) => {
      // Add the new message to our state
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    
    socket.on('new_message', handleNewMessage);

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [user]);

  // 4. Scroll to bottom whenever new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 5. Send a new message
  const handleSendMessage = async (e) => {
   e.preventDefault();
    const messageText = newMessage.trim();
    if (messageText === '') return;

    // 1. Clear the input box immediately
    setNewMessage('');

    // 2. Create a "fake" message object with our user info.
    // This is the "optimistic" part.
    const optimisticMessage = {
      _id: `temp-${Date.now()}`, // A temporary ID
      conversationId: conversationId,
      message: messageText,
      sender: { // 3. Manually "populate" the sender with our 'user' object
        _id: user._id,
        name: user.name,
        profilePic: user.profilePic 
      },
      createdAt: new Date().toISOString()
    };
    
    // 4. Add this new message to the state right away
    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

   try {
      // 5. In the background, send the *real* API request
      // We don't need to 'await' or use the response,
      // because our UI is already updated.
      API.post(`/api/chat/${conversationId}/messages`, {
        message: messageText,
      });
      // The backend will use Socket.IO to send the real
      // message to the *other* user.
      
    } catch (error) {
      console.error('Failed to send message:', error);
      // If the send fails, remove the "fake" message
      setMessages((prev) => prev.filter(m => m._id !== optimisticMessage._id));
      // And put the text back so the user can try again
      setNewMessage(messageText); 
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading chat...</div>;
  }

  return (
    <div className={styles.chatContainer}>
      {/* --- Header --- */}
      <header className={styles.chatHeader}>
        <Link to="/inbox" className={styles.backButton}>
          <BiArrowBack size={24} />
        </Link>
        {/* We can add the other user's name/pic here later */}
        <h1 className={styles.headerTitle}>Chat</h1>
      </header>

      {/* --- Message List --- */}
      <div className={styles.messageList}>
        {messages.map((msg) => {
          // Check if the message was sent by the current user
          const isMine = msg.sender._id === user._id;
          return (
            <div 
              key={msg._id} 
              className={`${styles.messageRow} ${isMine ? styles.myMessageRow : styles.theirMessageRow}`}
            >
              <div className={styles.messageBubble}>
                {msg.message}
              </div>
            </div>
          );
        })}
        {/* This empty div is the "bottom" we scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* --- Message Input Form --- */}
      <form className={styles.messageForm} onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          className={styles.messageInput}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className={styles.sendButton}>
          <BiSend size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;