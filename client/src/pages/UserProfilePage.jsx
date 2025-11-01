import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios'; // Use global axios for this public data
import ListingCard from '../components/ListingCard.jsx';
import styles from './ProfilePage.module.css'; // We can reuse the same styles!

const UserProfilePage = () => {
  const { id: userId } = useParams(); // Get the user's ID from the URL
  const { user: currentUser, toggleFollow } = useAuth(); // Get *our* login info

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Call our new backend route
        const { data } = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setProfile(data); // This data will be { user: {...}, listings: [...] }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]); // Re-fetch if the ID in the URL changes

  if (loading || !profile) {
    return <div className={styles.profileContainer}><p>Loading profile...</p></div>;
  }

  const { user, listings } = profile; // Destructure the profile data

  // Check if we are already following this user
  const isFollowing = currentUser?.following?.includes(user._id);
  // Check if this is our own profile
  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className={styles.profileContainer}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <img 
          src={user.profilePic || 'https://via.placeholder.com/80'} 
          alt="Profile" 
          className={styles.profileAvatar}
        />
        <h1 className={styles.profileName}>{user.name}</h1>
        <span className={styles.profileRole}>{user.role}</span>
        
        {/* Follower Stats */}
        <div className={styles.profileStats}>
          <div className={styles.statItem}>
            <strong>{listings?.length || 0}</strong>
            <span>Posts</span>
          </div>
          <div className={styles.statItem}>
            <strong>{user.followers?.length || 0}</strong>
            <span>Followers</span>
          </div>
          <div className={styles.statItem}>
            <strong>{user.following?.length || 0}</strong>
            <span>Following</span>
          </div>
        </div>
        
        {/* Show Follow button OR "My Profile" link */}
        {currentUser && !isOwnProfile && (
          <button 
            className={`${styles.followButton} ${isFollowing ? styles.following : ''}`}
            onClick={() => toggleFollow(user._id)}
          >
            {/* Text is controlled by CSS */}
          </button>
        )}
        {isOwnProfile && (
          <p className={styles.sellerMessage}>This is your public profile</p>
        )}
      </div>

      {/* Seller's Public Feed */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>All Posts from {user.name}</h2>
        <div className={styles.listingGrid}>
          {listings.length > 0 ? (
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))
          ) : (
            <p className={styles.emptyMessage}>This user has no active listings.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;