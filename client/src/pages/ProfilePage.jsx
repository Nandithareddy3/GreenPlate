// /client/src/pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import MyInquiryCard from '../components/MyInquiryCard.jsx';
import ReceivedInquiryCard from '../components/ReceivedInquiryCard.jsx';
import MyListingCard from '../components/ListingCard.jsx';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, logout, API } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await API.get('/api/users/profile'); 
      setProfileData(data); // This data has .followers and .following
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user, API]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateClaim = async (claimId, status) => {
    try {
      await API.put(`/api/claims/${claimId}`, { status });
      fetchProfile();
    } catch (error) {
      console.error('Failed to update claim:', error);
      alert('Failed to update claim.');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await API.delete(`/api/listings/${listingId}`);
        fetchProfile();
      } catch (error) {
        console.error('Failed to delete listing:', error);
        alert('Failed to delete listing.');
      }
    }
  };
  
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

  const renderSellerView = () => {
    const pendingInquiries = profileData?.claims?.filter(c => c.status === 'Pending') || [];
    const otherInquiries = profileData?.claims?.filter(c => c.status !== 'Pending') || [];

    return (
      <>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Received Inquiries ({pendingInquiries.length})</h2>
          {pendingInquiries.length > 0 ? (
            pendingInquiries.map((claim) => (
              <ReceivedInquiryCard 
                key={claim._id} 
                claim={claim} 
                onUpdate={handleUpdateClaim}
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>You have no new inquiries.</p>
          )}
        </div>

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
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Inquiry History</h2>
           {otherInquiries.length > 0 ? (
            otherInquiries.map((claim) => (
              <ReceivedInquiryCard 
                key={claim._id} 
                claim={claim} 
                onUpdate={handleUpdateClaim}
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>No confirmed or cancelled inquiries.</p>
          )}
        </div>
      </>
    );
  };

  // We show "Loading..." until BOTH profileData AND user are loaded
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

        {/* This stats block uses profileData, which is fetched live */}
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
        </div>
        
        <button onClick={logout} className={styles.logoutButton}>
          Log Out
        </button>
      </div>

      {user.role === 'Taker' ? renderTakerView() : renderSellerView()}
    </div>
  );
};

export default ProfilePage;