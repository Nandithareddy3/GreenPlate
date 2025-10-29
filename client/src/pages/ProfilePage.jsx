import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import MyInquiryCard from '../components/MyInquiryCard.jsx';
// We'll import these seller components later
// import ReceivedInquiryCard from '../components/ReceivedInquiryCard.jsx';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, logout } = useAuth(); // Get current user
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return; // Wait for user to be loaded
      try {
        // This is the /api/users/profile route we built!
        // It returns claims for "Takers" and listings for "Sellers"
        const { data } = await axios.get('http://localhost:5000/api/users/profile');
        setProfileData(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const renderTakerView = () => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>My Inquiries</h2>
      {profileData?.claims?.length > 0 ? (
        profileData.claims.map((claim) => (
          <MyInquiryCard key={claim._id} claim={claim} />
        ))
      ) : (
        <p className={styles.emptyMessage}>You haven't made any inquiries yet.</p>
      )}
    </div>
  );

  const renderSellerView = () => (
    <>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Received Inquiries</h2>
        {/* We will build this part next */}
        <p className={styles.emptyMessage}>You have no new inquiries.</p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>My Active Listings</h2>
        {profileData?.listings?.length > 0 ? (
          /* We can reuse our ListingCard here, but we'll make a smaller one later */
          <p>{profileData.listings.length} active listings</p>
        ) : (
          <p className={styles.emptyMessage}>You have no active listings.</p>
        )}
      </div>
    </>
  );

  if (loading || !profileData) {
    return <div className={styles.profileContainer}><p>Loading profile...</p></div>;
  }

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
        <button onClick={logout} className={styles.logoutButton}>
          Log Out
        </button>
      </div>

      {/* Dynamic Content */}
      {user.role === 'Taker' ? renderTakerView() : renderSellerView()}
    </div>
  );
};

export default ProfilePage;