import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MyInquiryCard.module.css';

// This helper gives a color to each status
const getStatusClass = (status) => {
  switch (status) {
    case 'Confirmed':
      return styles.statusConfirmed;
    case 'Cancelled':
      return styles.statusCancelled;
    case 'Completed':
      return styles.statusCompleted;
    case 'Pending':
    default:
      return styles.statusPending;
  }
};

const MyInquiryCard = ({ claim }) => {
  if (!claim || !claim.listing) return null;
  
  const listing = claim.listing;

  return (
    <Link to={`/listing/${listing._id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img 
          src={listing.imageUrl} 
          alt={listing.title} 
          className={styles.cardImage} 
        />
        <div className={styles.cardContent}>
          <span className={styles.sellerName}>
            From {listing.seller?.name || 'Seller'}
          </span>
          <h3 className={styles.cardTitle}>{listing.title}</h3>
        </div>
        <div className={`${styles.statusBadge} ${getStatusClass(claim.status)}`}>
          {claim.status}
        </div>
      </div>
    </Link>
  );
};

export default MyInquiryCard;