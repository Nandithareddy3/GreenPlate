import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MyListingCard.module.css'; // This will be a new CSS file

const MyListingCard = ({ listing, onDelete }) => {
  return (
    <div className={styles.card}>
      <img 
        src={listing.imageUrl} 
        alt={listing.title} 
        className={styles.cardImage} 
      />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{listing.title}</h3>
        <span className={styles.status}>Status: {listing.status}</span>
      </div>
      <div className={styles.buttonGroup}>
        {/* This "Edit" button links to the edit page */}
        <Link 
          to={`/edit/${listing._id}`} 
          className={`${styles.button} ${styles.editButton}`}
        >
          Edit
        </Link>
        {/* This button will delete the post */}
        <button 
          onClick={() => onDelete(listing._id)}
          className={`${styles.button} ${styles.deleteButton}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MyListingCard;