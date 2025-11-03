import React from 'react';
import styles from './StoryCircle.module.css';

const StoryCircle = ({ story, onClick }) => {
  return (
    <div className={styles.storyWrapper} onClick={onClick}>
      <div className={styles.storyRing}>
        <img
          // ⭐️ FIX: Use the user's profile pic for the circle
          src={story.user.profilePic || 'https://via.placeholder.com/64'}
          alt={story.user.name}
          className={styles.storyImage}
        />
      </div>
      <p className={styles.storyName}>{story.user.name}</p>
    </div>
  );
};

export default StoryCircle;