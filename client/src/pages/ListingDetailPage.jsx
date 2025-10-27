// client/src/pages/ListingDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import listingService from '../services/listingService';
import claimService from '../services/claimService';
import { useAuth } from '../context/AuthContext';
import styles from './ListingDetailPage.module.css';

const ListingDetailPage = () => {
    const { listingId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setIsLoading(true);
                const data = await listingService.getListingById(listingId);
                setListing(data);
            } catch (err) {
                setError('Could not fetch listing details. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchListing();
    }, [listingId]);

    // ## THIS FUNCTION WAS MISSING ##
    const handleClaim = async () => {
        if (!user) {
            alert('Please log in to claim an item.');
            navigate('/login');
            return;
        }

        if (user._id === listing.seller._id) {
            alert("You can't claim your own listing!");
            return;
        }

        try {
            await claimService.createClaim(listingId, user.token);
            alert('Success! The item has been reserved for you.');
            setListing((prevListing) => ({ ...prevListing, status: 'Claimed' }));
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || 'Could not claim item.'}`);
        }
    };

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
                    <p><strong>Location:</strong> Secunderabad (More details after claim)</p>
                </div>
                <button
                    onClick={handleClaim} // This line was causing the error
                    className={styles.claimButton}
                    disabled={listing.status === 'Claimed'}
                >
                    {listing.status === 'Claimed' ? 'Item Claimed' : 'Request Pickup'}
                </button>
            </div>
        </div>
    );
};

export default ListingDetailPage;