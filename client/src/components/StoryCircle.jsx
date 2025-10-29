import React from 'react';
import styles from './StoryCircle.module.css';

const StoryCircle = ({ story, onClick }) => {
  return (
    <div className={styles.storyWrapper} onClick={onClick}>
      <div className={styles.storyRing}>
        <img
          // Use a placeholder if the story has no image or user has no pic
          src={story.imageUrl || 'https://via.placeholder.com/64'}
          alt={story.user.name}
          className={styles.storyImage}
        />
      </div>
      <p className={styles.storyName}>{story.user.name}</p>
    </div>
  );
};

export default StoryCircle;