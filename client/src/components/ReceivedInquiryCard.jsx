import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ReceivedInquiryCard.module.css';

const ReceivedInquiryCard = ({ claim, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);

  // We pass the onUpdate function from the ProfilePage
  const handleUpdate = async (status) => {
    setIsLoading(true);
    await onUpdate(claim._id, status);
    // The ProfilePage will handle refetching, so we just stop loading
    setIsLoading(false);
  };

  if (!claim || !claim.listing) return null;

  return (
    <div className={styles.card}>
      <img 
        src={claim.listing.imageUrl} 
        alt={claim.listing.title} 
        className={styles.cardImage} 
      />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{claim.listing.title}</h3>
        <span className={styles.takerInfo}>
          Inquiry from <strong>{claim.taker?.name || 'Unknown User'}</strong>
        </span>
      </div>

      {/* Show buttons only if the claim is still "Pending" */}
      {claim.status === 'Pending' && (
        <div className={styles.buttonGroup}>
          <button 
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={() => handleUpdate('Cancelled')}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={() => handleUpdate('Confirmed')}
            disabled={isLoading}
          >
            Confirm
          </button>
        </div>
      )}

      {/* Show a simple message for non-pending claims */}
      {claim.status !== 'Pending' && (
        <div className={styles.statusBadge}>
          {claim.status}
        </div>
      )}
    </div>
  );
};

export default ReceivedInquiryCard;