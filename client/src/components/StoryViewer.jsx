import React from 'react';
import Modal from 'react-modal';
import styles from './StoryViewer.module.css';

// --- Modal Styling ---
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1100,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#111',
    border: 'none',
    padding: 0,
    width: '90%',
    maxWidth: '400px',
    height: '90vh',
    maxHeight: '700px',
  },
};
// ---------------------

// Tell the modal which element to hide for screen readers
Modal.setAppElement('#root');

const StoryViewer = ({ story, isOpen, onRequestClose }) => {
  if (!story) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Story Viewer"
    >
      <div className={styles.storyContainer}>
        {/* Story Image */}
        <img 
          src={story.imageUrl} 
          alt={story.caption || 'Story'} 
          className={styles.storyImage} 
        />
        
        {/* Close Button */}
        <button onClick={onRequestClose} className={styles.closeButton}>
          &times;
        </button>
        
        {/* Seller Info */}
        <div className={styles.storyHeader}>
          <img 
            src={story.user.profilePic || 'https://via.placeholder.com/40'} 
            alt={story.user.name}
            className={styles.sellerAvatar}
          />
          <span className={styles.sellerName}>{story.user.name}</span>
        </div>

        {/* Caption */}
        {story.caption && (
          <p className={styles.storyCaption}>{story.caption}</p>
        )}
      </div>
    </Modal>
  );
};

export default StoryViewer;