import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios'; // For the public GET request
import Button from '../components/Button.jsx';
import { BiMap, BiTime, BiCategoryAlt } from 'react-icons/bi';
import styles from './ListingDetailPage.module.css';

// Helper to format the date
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const ListingDetailPage = () => {
  const { id } = useParams(); // Get the listing ID from the URL
  const { user, token, toggleFollow, API } = useAuth(); // Get user, auth functions, and API instance
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false); // For button loading

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // Use the global 'axios' here since this is a public route
        const { data } = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(data);
      } catch (err) {
        setError('Failed to load listing.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleClaimClick = async () => {
    if (!token) {
      navigate('/login'); // Redirect to login if not signed in
      return;
    }
    
    setIsClaiming(true);
    try {
      // Use the context 'API' here since this is a protected route
      await API.post(`/api/claims/${id}`);
      
      alert('Your inquiry has been sent to the seller!');
      navigate('/profile'); // Send user to their "claims" page
      
    } catch (err) {
      alert('Failed to send inquiry. You may have already claimed this item.');
      console.error(err);
    } finally {
      setIsClaiming(false);
    }
  };

  if (loading) return <div className={styles.pageContainer}><p>Loading...</p></div>;
  if (error) return <div className={styles.pageContainer}><p>{error}</p></div>;
  if (!listing) return null; // Don't render if no listing

  // Safe checks for seller and follow status
  const isSeller = user && user._id === listing.seller?._id;
  const canClaim = user && user.role === 'Taker';
  
  // ⭐️ CORRECTED LINE: Safely checks if user.following exists, then calls .includes
  const isFollowing = user?.following?.includes(listing.seller?._id);

  return (
    <div className={styles.pageContainer}>
      {/* 1. Hero Image */}
      <img src={listing.imageUrl} alt={listing.title} className={styles.heroImage} />
      
      {/* 2. Content */}
      <div className={styles.content}>
        
        {/* Seller Info */}
        <div className={styles.sellerInfo}>
          <img 
            src={listing.seller?.profilePic || 'https://via.placeholder.com/40'} 
            alt={listing.seller?.name || 'Seller'} // Safe check
            className={styles.sellerAvatar}
          />
          <div className={styles.sellerDetails}>
            <span className={styles.postedBy}>Posted by</span>
            <span className={styles.sellerName}>
              {listing.seller?.name || 'Unknown Seller'} {/* Safe check */}
            </span>
          </div>
          
          {/* Follow Button */}
          {user && !isSeller && (
            <button 
              className={`${styles.followButton} ${isFollowing ? styles.following : ''}`}
              onClick={() => toggleFollow(listing.seller._id)}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* Title */}
        <h1 className={styles.title}>{listing.title}</h1>

        {/* Description */}
        <p className={styles.description}>{listing.description}</p>

        {/* Detail Tags */}
        <div className={styles.detailList}>
          <div className={styles.detailItem}>
            <BiCategoryAlt />
            <span className={styles.categoryTag}>{listing.category}</span>
          </div>
          <div className={styles.detailItem}>
            <BiTime />
            <span>Expires: {formatDateTime(listing.expiryDate)}</span>
          </div>
          <div className={styles.detailItem}>
            <BiMap />
            {/* We'll add a real map/address later */}
            <span>123 Main St, Anytown</span>
          </div>
        </div>

        {/* 3. Action Button */}
        <div className={styles.actionButtonWrapper}>
          {/* Only show button if user is a "Taker" AND is NOT the seller */}
          {canClaim && !isSeller && (
            <Button 
              text="I'm Interested!" 
              onClick={handleClaimClick}
              isLoading={isClaiming}
            />
          )}
          {/* Show a message if the user is the seller */}
          {isSeller && (
            <p className={styles.sellerMessage}>This is your listing.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;