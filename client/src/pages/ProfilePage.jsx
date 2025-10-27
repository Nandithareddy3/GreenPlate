// client/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import styles from './ProfilePage.module.css';
import ListingCard from '../components/ListingCard';

const ProfilePage = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.token) {
                try {
                    const data = await authService.getProfile(user.token);
                    setProfileData(data);
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user]); // The effect now correctly depends on the user object

    if (isLoading) {
        return <div className={styles.centered}>Loading profile...</div>;
    }

    if (!profileData) {
        return <div className={styles.centered}>Could not load profile. Please try logging in again.</div>;
    }
    const isSeller = profileData.role === 'Seller';

    return (
        <div className={styles.pageContainer}>
            <div className={styles.profileHeader}>
                <div className={styles.avatar}></div>
                <h1 className={styles.name}>{profileData.name}</h1>
                <p className={styles.email}>{profileData.email}</p>
            </div>

            <div className={styles.impactCard}>
                <h2>Your Impact</h2>
                {isSeller ? (
                    <p>You've posted <strong>{profileData.listings?.length || 0}</strong> items for rescue!</p>
                ) : (
                    <p>You've claimed <strong>{profileData.claims?.length || 0}</strong> items!</p>
                )}
            </div>

            <div className={styles.activitySection}>
                <h2>{isSeller ? 'Your Active Listings' : 'Your Claim History'}</h2>
                {isSeller ? (
                    // Seller's view: Show their listings
                    profileData.listings?.length > 0 ? (
                        profileData.listings.map(listing => <ListingCard key={listing._id} listing={listing} />)
                    ) : <p>You haven't posted any listings yet.</p>
                ) : (
                    // Taker's view: Show their claims
                    profileData.claims?.length > 0 ? (
                        profileData.claims.map(claim => (
                            <div key={claim._id} className={styles.claimItem}>
                                <span>{claim.listing.title}</span>
                                <span className={`${styles.status} ${styles[claim.status.toLowerCase()]}`}>{claim.status}</span>
                            </div>
                        ))
                    ) : <p>You haven't claimed any items yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;