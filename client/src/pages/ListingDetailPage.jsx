import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import Button from '../components/Button.jsx'; // This is your main green button
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
  const { id: listingId } = useParams();
  const navigate = useNavigate();
  const { user, token, toggleFollow, API, loading: authLoading } = useAuth(); 

  const [listing, setListing] = useState(null);
  const [listingLoading, setListingLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ⭐️ START OF FIX ⭐️ ---
  // We need to define BOTH loading states
  const [isClaiming, setIsClaiming] = useState(false); // For "I'm Interested!"
  const [isStartingChat, setIsStartingChat] = useState(false); // For "Message Seller"
  // --- ⭐️ END OF FIX ⭐️ ---


  useEffect(() => {
    const fetchListing = async () => {
      try {
        setListingLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/listings/${listingId}`);
        setListing(data);
      } catch (err) {
        setError('Failed to load listing.');
      } finally {
        setListingLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  // Function for the "I'm Interested" button
  const handleClaimClick = async () => {
    if (!token) { navigate('/login'); return; }
    setIsClaiming(true); // Use its own state
    try {
      await API.post(`/api/claims/${listingId}`);
      alert('Your inquiry has been sent to the seller!');
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send inquiry.');
    } finally {
      setIsClaiming(false); // Use its own state
    }
  };

  // Function for the "Message Seller" button
  const handleStartChat = async () => {
    if (!token) { navigate('/login'); return; }
    setIsStartingChat(true); // Use its own state
    try {
      const { data } = await API.post(`/api/chat/${listingId}`);
      navigate(`/chat/${data.conversationId}`);
    } catch (err) {
      alert('Failed to start chat.');
    } finally {
      setIsStartingChat(false); // Use its own state
    }
  };

  if (listingLoading || authLoading) {
    return <div className={styles.pageContainer}><p>Loading...</p></div>;
  }
  if (error) return <div className={styles.pageContainer}><p>{error}</p></div>;
  if (!listing) return <div className={styles.pageContainer}><p>Listing not found.</p></div>;

  const isSeller = user && user._id === listing.seller?._id;
  const canClaimOrChat = user && user.role === 'Taker';
  const isFollowing = user?.following?.includes(listing.seller?._id);

  return (
    <div className={styles.pageContainer}>
      {/* ... (Hero Image and Seller Info are the same) ... */}
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
            {user && !isSeller && (
              <button 
                className={`${styles.followButton} ${isFollowing ? styles.following : ''}`}
                onClick={() => toggleFollow(listing.seller._id)}
              >
                {/* Text is controlled by CSS */}
              </button>
            )}
        </div>

        {/* ... (Title, Description, Detail List are the same) ... */}
        <h1 className={styles.title}>{listing.title}</h1>
        <p className={styles.description}>{listing.description}</p>
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


        {/* --- Action Button Wrapper --- */}
        <div className={styles.actionButtonWrapper}>
          {canClaimOrChat && !isSeller && (
            <>
              {/* Button 1: The main "Claim" button */}
              <Button 
                text="I'm Interested!" 
                onClick={handleClaimClick}
                isLoading={isClaiming} // Uses its own loading state
              />
              {/* Button 2: The "Chat" button */}
              <button 
                className={styles.secondaryButton}
                onClick={handleStartChat}
                disabled={isStartingChat} // Uses its own loading state
              >
                {isStartingChat ? 'Loading...' : 'Message Seller'}
              </button>
            </>
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