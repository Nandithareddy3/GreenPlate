import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ListingCardSmall.module.css';
import { BiTime } from 'react-icons/bi';

const formatExpiry = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const ListingCardSmall = ({ listing }) => {
  if (!listing) return null;

  return (
    <Link to={`/listing/${listing._id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img 
          src={listing.imageUrl} 
          alt={listing.title} 
          className={styles.cardImage} 
        />
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{listing.title}</h3>
          <span className={styles.sellerName}>
            {listing.seller?.name || 'Seller'}
          </span>
          <div className={styles.expiryInfo}>
            <BiTime />
            <span>Expires {formatExpiry(listing.expiryDate)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCardSmall;