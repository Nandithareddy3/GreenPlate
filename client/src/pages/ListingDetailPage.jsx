// client/src/pages/ListingDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import listingService from '../services/listingService';
import styles from './ListingDetailPage.module.css';

const ListingDetailPage = () => {
    const { listingId } = useParams(); // Get the ID from the URL

    // State for the component
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect to fetch data when the component mounts
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setIsLoading(true);
                const data = await listingService.getListingById(listingId);
                setListing(data);
            } catch (err) {
                setError('Could not fetch listing details. It may have been claimed or removed.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListing();
    }, [listingId]); // The dependency array ensures this runs again if the user navigates to a new listing page

    // ## CHECKPOINT 4: GRACEFUL DATA HANDLING ##
    if (isLoading) {
        return <div className={styles.centered}>Loading...</div>;
    }

    if (error) {
        return <div className={`${styles.centered} ${styles.error}`}>{error}</div>;
    }

    if (!listing) {
        return <div className={styles.centered}>Listing not found.</div>;
    }

    return (
        <div className={styles.detailContainer}>
            <img
                src={listing.imageUrl || "https://placehold.co/600x400/A8D8B9/4A4A4A?text=GreenPlate"}
                alt={listing.title}
                className={styles.listingImage}
            />
            <div className={styles.infoSection}>
                <h1 className={styles.title}>{listing.title}</h1>
                <div className={styles.sellerInfo}>
                    <p>Listed by: <strong>{listing.seller.name}</strong></p>
                </div>
                <p className={styles.description}>{listing.description}</p>
                <div className={styles.pickupInfo}>
                    <h3>Pickup Details</h3>
                    <p><strong>Expires on:</strong> {new Date(listing.expiryDate).toLocaleString()}</p>
                    <p><strong>Location:</strong> Secunderabad (Exact address provided after claim)</p>
                </div>
                <button className={styles.claimButton}>Request Pickup</button>
            </div>
        </div>
    );
};

export default ListingDetailPage;