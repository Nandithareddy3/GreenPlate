import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import Button from '../components/Button.jsx';
import { BiMap, BiTime, BiCategoryAlt } from 'react-icons/bi';
import styles from './ListingDetailPage.module.css';

// Helper to format the date
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
};

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get user AND the authLoading state
  const { user, token, toggleFollow, API, loading: authLoading } = useAuth(); 

  const [listing, setListing] = useState(null);
  const [listingLoading, setListingLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setListingLoading(true);
        // Use global axios for this public request
        const { data } = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(data);
      } catch (err) {
        setError('Failed to load listing.');
        console.error(err);
      } finally {
        setListingLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleClaimClick = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setIsClaiming(true);
    try {
      // Use context API for this protected request
      await API.post(`/api/claims/${id}`);
      alert('Your inquiry has been sent to the seller!');
      navigate('/profile');
    } catch (err) {
      alert('Failed to send inquiry. You may have already claimed this item.');
      console.error(err);
    } finally {
      setIsClaiming(false);
    }
  };

  // Wait for BOTH the listing and the user to be loaded
  if (listingLoading || authLoading) {
    return <div className={styles.pageContainer}><p>Loading...</p></div>;
  }

  if (error) return <div className={styles.pageContainer}><p>{error}</p></div>;
  if (!listing) return <div className={styles.pageContainer}><p>Listing not found.</p></div>;

  // Now we can safely do our checks
  const isSeller = user && user._id === listing.seller?._id;
  const canClaim = user && user.role === 'Taker';
  const isFollowing = user?.following?.includes(listing.seller?._id);

  return (
    <div className={styles.pageContainer}>
      <img src={listing.imageUrl} alt={listing.title} className={styles.heroImage} />
      
      <div className={styles.content}>
        
        <div className={styles.sellerInfo}>
          <img 
            src={listing.seller?.profilePic || 'https://via.placeholder.com/40'} 
            alt={listing.seller?.name || 'Seller'}
            className={styles.sellerAvatar}
          />
          <div className={styles.sellerDetails}>
            <span className={styles.postedBy}>Posted by</span>
            <Link to={`/profile/${listing.seller._id}`} className={styles.sellerLink}>
              <span className={styles.sellerName}>
                {listing.seller?.name || 'Unknown Seller'}
              </span>
            </Link>
          </div>
          
          {/* Follow Button */}
          {user && !isSeller && (
            <button 
              className={`${styles.followButton} ${isFollowing ? styles.following : ''}`}
              onClick={() => toggleFollow(listing.seller._id)}
            >
              {/* Text is controlled by CSS */}
            </button>
          )}
        </div>

        <h1 className={styles.title}>{listing.title}</h1>
        <p className={styles.description}>{listing.description}</p>

        {/* --- ⭐️ THIS IS THE CORRECTED SECTION ⭐️ --- */}
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
            <span>123 Main St, Anytown</span>
          </div>
        </div>
        {/* --- ⭐️ END OF CORRECTED SECTION ⭐️ --- */}


        {/* 5. This is the button logic. */}
        <div className={styles.actionButtonWrapper}>
          {canClaim && !isSeller && (
            <Button 
              text="I'm Interested!" 
              onClick={handleClaimClick}
              isLoading={isClaiming}
            />
          )}
          {isSeller && (
            <p className={styles.sellerMessage}>This is your listing.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;