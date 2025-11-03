import React from 'react';
import { BiMap, BiTime } from 'react-icons/bi';
import styles from './ListingCard.module.css';
import { Link } from 'react-router-dom';

// We'll use this helper to format dates
const formatExpiry = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const ListingCard = ({ listing }) => {
  if (!listing) return null;

  return (
    <div className={styles.card}>
      {/* 1. Image */}
      <img 
        src={listing.imageUrl} 
        alt={listing.title} 
        className={styles.cardImage} 
      />
      
      {/* 2. Content */}
      <div className={styles.cardContent}>
        {/* Seller Info */}
        <div className={styles.sellerInfo}>
          <img 
            src={listing.seller?.profilePic || 'https://via.placeholder.com/40'} 
            alt={listing.seller?.name || 'Seller'}
            className={styles.sellerAvatar}
          />
          <Link to={`/profile/${listing.seller._id}`} className={styles.sellerLink}>
            <span className={styles.sellerName}>
              {listing.seller?.name || 'Seller'}
            </span>
          </Link>
        </div>
        
        {/* Listing Title */}
        <h3 className={styles.cardTitle}>{listing.title}</h3>
        
        {/* Details (Category & Location) */}
        <div className={styles.cardDetails}>
          <span className={styles.categoryTag}>{listing.category}</span>
          <span className={styles.location}>
            <BiMap /> 
            {/* We'll add real distance later */}
            2.5km away 
          </span>
        </div>
        
        {/* Expiry Time */}
        <div className={styles.expiryInfo}>
          <BiTime />
          <span>Expires today at {formatExpiry(listing.expiryDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;