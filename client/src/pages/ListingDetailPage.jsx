import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import listingService from '../services/listingService';
import claimService from '../services/claimService';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import styles from './ListingDetailPage.module.css';

const ListingDetailPage = () => {
    const { listingId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setIsLoading(true);
                const data = await listingService.getListingById(listingId);
                setListing(data);

                if (user && data) {
                    setIsFollowing(user.following.includes(data.seller._id));
                }
            } catch (err) {
                setError('Could not fetch listing details. It may have been removed.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchListing();
    }, [listingId, user]);

    // ✅ RENAMED and UPDATED: This function now sends an "Inquiry".
    const handleInquiry = async () => {
        if (!user) {
            alert('Please log in to express interest.');
            navigate('/login');
            return;
        }
        try {
            await claimService.createClaim(listingId, user.token);
            // Updated success message.
            alert('Inquiry sent! The seller has been notified.');
            // We no longer change the local state, as the post remains public.
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || 'Could not send inquiry.'}`);
        }
    };

    const handleFollow = async () => {
        if (!user) {
            alert('Please log in to follow sellers.');
            return;
        }
        try {
            await authService.followUser(listing.seller._id, user.token);
            setIsFollowing(!isFollowing);
        } catch (error) {
            alert('Something went wrong. Please try again.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to permanently delete this post?')) {
            try {
                await listingService.deleteListing(listingId, user.token);
                alert('Post deleted successfully.');
                navigate('/');
            } catch (error) {
                alert('Failed to delete the post.');
            }
        }
    };

    // --- Render Logic ---
    if (isLoading) { return <div className={styles.centered}>Loading...</div>; }
    if (error) { return <div className={`${styles.centered} ${styles.error}`}>{error}</div>; }
    if (!listing) { return <div className={styles.centered}>Post not found.</div>; }

    const isOwner = user?._id === listing.seller._id;

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
                    <p>Posted by: <strong>{listing.seller.name}</strong></p>
                    {user && !isOwner && (
                        <button onClick={handleFollow} className={isFollowing ? styles.unfollowButton : styles.followButton}>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                </div>

                <p className={styles.description}>{listing.description}</p>

                <div className={styles.pickupInfo}>
                    <h3>Pickup Details</h3>
                    <p><strong>Expires on:</strong> {new Date(listing.expiryDate).toLocaleString()}</p>
                    <p><strong>Location:</strong> Secunderabad (Approximate location)</p>
                </div>

                {/* ✅ UPDATED: Main action button is now for inquiries and hidden from the owner. */}
                {!isOwner && (
                    <button onClick={handleInquiry} className={styles.claimButton}>
                        I'm Interested!
                    </button>
                )}

                {/* Owner-specific action buttons for editing and deleting */}
                {isOwner && (
                    <div className={styles.ownerActions}>
                        <button onClick={() => alert("Edit feature coming soon!")} className={styles.editButton}>Edit Post</button>
                        <button onClick={handleDelete} className={styles.deleteButton}>Delete Post</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingDetailPage;