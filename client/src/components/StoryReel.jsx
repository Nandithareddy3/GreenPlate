import React, { useState, useEffect } from 'react';
import StoryCircle from './StoryCircle.jsx';
import { useAuth } from '../context/AuthContext.jsx'; // To get the token
import axios from 'axios';
import styles from './StoryReel.module.css';

const StoryReel = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(); // Get token to authorize request

  useEffect(() => {
    const fetchStories = async () => {
      if (!token) return; // Don't fetch if not logged in

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        // Use the API route we built on the backend
        const { data } = await axios.get('http://localhost:5000/api/stories', config);
        
        // Group stories by user to show only one circle per user
        const userStoryMap = new Map();
        for (const story of data) {
          if (!userStoryMap.has(story.user._id)) {
            // We need to populate user data if it's not already
            // For now, assuming API sends populated user
            if (story.user && story.user.name) {
               userStoryMap.set(story.user._id, story);
            }
          }
        }
        
        setStories(Array.from(userStoryMap.values()));
        
      } catch (error) {
        console.error('Failed to fetch stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [token]);

  // TODO: Add a click handler to open a story viewer modal
  const handleStoryClick = (story) => {
    console.log('Opening story:', story);
    // We'll build the story viewer modal later
  };

  if (loading) {
    return <div className={styles.loadingText}>Loading stories...</div>;
  }

  if (stories.length === 0) {
    return null; // Don't show the reel if there are no stories
  }

  return (
    // This creates the horizontal scrolling container
    <div className={styles.storyReelContainer}>
      {/* We can add a "Your Story" circle here later */}
      
      {stories.map((story) => (
        <StoryCircle
          key={story._id}
          story={story}
          onClick={() => handleStoryClick(story)}
        />
      ))}
    </div>
  );
};

export default StoryReel;