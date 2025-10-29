import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
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
  const { user, token } = useAuth(); // Get current user
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false); // For button loading

  useEffect(() => {
    const fetchListing = async () => {
      try {
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
      // Call the "create claim" API we built
      await axios.post(`http://localhost:5000/api/claims/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // On success, show an alert and send user to their "claims" page
      alert('Your inquiry has been sent to the seller!');
      navigate('/profile'); // We'll build this page to show "My Claims"
      
    } catch (err) {
      alert('Failed to send inquiry. You may have already claimed this item.');
      console.error(err);
    } finally {
      setIsClaiming(false);
    }
  };

  if (loading) return <div className={styles.pageContainer}><p>Loading...</p></div>;
  if (error) return <div className={styles.pageContainer}><p>{error}</p></div>;
  if (!listing) return null;

  // Check if the current user is the seller
  const isSeller = user && user._id === listing.seller._id;
  // Check if the user is a "Taker"
  const canClaim = user && user.role === 'Taker';

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
            alt={listing.seller.name}
            className={styles.sellerAvatar}
          />
          <div>
            <span className={styles.postedBy}>Posted by</span>
            <span className={styles.sellerName}>{listing.seller.name}</span>
          </div>
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