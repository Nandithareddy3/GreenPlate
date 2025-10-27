import React from 'react';
import styles from './StoryReel.module.css';
import { Link } from 'react-router-dom';

const StoryReel = ({ stories }) => {
    return (
        <div className={styles.storyReel}>
            <Link to="/create-story" className={styles.story}>
                <div className={styles.addStory}>+</div>
                <span className={styles.storyUser}>Add Story</span>
            </Link>
            {stories.map(story => (
                <div key={story._id} className={styles.story}>
                    <img src={story.imageUrl} alt={`${story.user.name}'s story`} className={styles.storyImage} />
                    <span className={styles.storyUser}>{story.user.name}</span>
                </div>
            ))}
        </div>
    );
};
export default StoryReel;