import React from 'react';
import styles from './ListingCard.module.css';
import { Link } from 'react-router-dom';
const ListingCard = ({ listing }) => {
    const fallbackImageUrl = `https://placehold.co/400x300/A8D8B9/4A4A4A?text=GreenPlate`;

    const imageUrl = "https://via.placeholder.com/400x300.png/A8D8B9/4A4A4A?text=GreenPlate";
    return (
        <Link to={`/listing/${listing._id}`} className={styles.cardLink}>
            <div className={styles.card}>
                <div className={styles.sellerInfo}>
                    <div className={styles.sellerAvatar}></div>
                    <span>{listing.seller.name}</span>
                </div>
                <img
                    src={listing.imageUrl || fallbackImageUrl}
                    alt={listing.title}
                    className={styles.cardImage}
                />
                <div className={styles.cardOverlay}>
                    <h3 className={styles.cardTitle}>{listing.title}</h3>
                    <p className={styles.cardLocation}>📍 Secunderabad, ~2km away</p>
                    <p className={styles.cardExpiry}> Expires in 4 hours</p>
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;