import React, { useState, useEffect } from 'react';
import StoryCircle from './StoryCircle.jsx';
import StoryViewer from './StoryViewer.jsx'; // 1. Import the new modal
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import styles from './StoryReel.module.css';

const StoryReel = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  
  // 2. Add state to manage the modal
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get('http://localhost:5000/api/stories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Group stories by user
        const userStoryMap = new Map();
        for (const story of data) {
          // 3. Make sure user is populated and exists
          if (story.user && story.user.name) {
             // We'll just show the *latest* story for each user
             if (!userStoryMap.has(story.user._id)) {
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

  // 4. Click handler to open the modal
  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  if (loading) {
    return <div className={styles.loadingText}>Loading stories...</div>;
  }
  if (stories.length === 0) {
    return null;
  }

  return (
    <>
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

      {/* 5. Render the modal (it's hidden by default) */}
      <StoryViewer 
        story={selectedStory}
        isOpen={!!selectedStory}
        onRequestClose={() => setSelectedStory(null)}
      />
    </>
  );
};

export default StoryReel;