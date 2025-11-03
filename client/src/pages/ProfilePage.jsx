import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Make sure Link is imported
import { useAuth } from '../context/AuthContext.jsx';
import MyListingCard from '../components/MyListingCard.jsx';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, logout, API } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function fetches your profile, including follower counts and listings
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // This single API call has all our data: listings, claims, followers
      const { data } = await API.get('/api/users/profile'); 
      setProfileData(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user, API]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // This function handles deleting a listing
  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await API.delete(`/api/listings/${listingId}`);
        fetchProfile(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete listing:', error);
        alert('Failed to delete listing.');
      }
    }
  };
  
  // This renders the Seller's view (only their listings)
  const renderSellerView = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>My Active Listings</h2>
      {profileData?.listings?.length > 0 ? (
        profileData.listings.map((listing) => (
          <MyListingCard 
            key={listing._id} 
            listing={listing}
            onDelete={handleDeleteListing}
          />
        ))
      ) : (
        <p className={styles.emptyMessage}>You have no active listings.</p>
      )}
    </div>
  );

  // This renders the Taker's view
  const renderTakerView = () => (
     <div className={styles.section}>
      <h2 className={styles.sectionTitle}>My Activity</h2>
       <p className={styles.emptyMessage}>All your inquiries are now conversations in your Inbox (Chat icon).</p>
    </div>
  );

  if (loading || !profileData || !user) {
    return <div className={styles.profileContainer}><p>Loading profile...</p></div>;
  }

  // --- MAIN RETURN ---
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img 
          src={user.profilePic || 'https://via.placeholder.com/80'} 
          alt="Profile" 
          className={styles.profileAvatar}
        />
        <h1 className={styles.profileName}>{user.name}</h1>
        <span className={styles.profileRole}>{user.role}</span>
        
        {/* --- ⭐️ START OF FIX ⭐️ --- */}
        <div className={styles.profileStats}>
          <div className={styles.statItem}>
            <strong>{profileData.listings?.length || 0}</strong>
            <span>Posts</span>
          </div>
          <div className={styles.statItem}>
            <strong>{profileData.followers?.length || 0}</strong>
            <span>Followers</span>
          </div>
          <div className={styles.statItem}>
            <strong>{profileData.following?.length || 0}</strong>
            <span>Following</span>
          </div>
        </div> {/* <-- 1. This closing tag was missing */}
        
        <div className={styles.buttonGroup}>
          <Link to="/create-story" className={styles.profileButton}>
            Add Story
          </Link>
          <Link to="/profile/edit" className={styles.profileButton}>
            Edit Profile
          </Link>
        </div>
        {/* --- ⭐️ END OF FIX ⭐️ --- */}
        
        <button onClick={logout} className={styles.logoutButton}>
          Log Out
        </button>
      </div>

      {user.role === 'Taker' ? renderTakerView() : renderSellerView()}
    </div>
  );
};

export default ProfilePage;