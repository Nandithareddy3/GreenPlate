import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import StoryReel from '../components/StoryReel.jsx';
import ListingCard from '../components/ListingCard.jsx'; // 1. Import ListingCard
import { Link } from 'react-router-dom'; // 2. Import Link
import axios from 'axios';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { user, logout } = useAuth();
  const [listings, setListings] = useState([]); // 3. State for listings
  const [loading, setLoading] = useState(true);

  // 4. Fetch listings from the API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // This is a public route, no token needed
        const { data } = await axios.get('http://localhost:5000/api/listings');
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <h1 className={styles.logo}>GreenPlate</h1>
      </div>

      <StoryReel />

      <div className={styles.feedContainer}>
        <h2 className={styles.title}>Feed</h2>
        
        {/* 5. Render the feed */}
        {loading ? (
          <p>Loading listings...</p>
        ) : (
          <div className={styles.listingGrid}>
            {listings.map((listing) => (
              // 6. Wrap card in a Link to a detail page
              <Link to={`/listing/${listing._id}`} key={listing._id} className={styles.cardLink}>
                <ListingCard listing={listing} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <button onClick={logout} className={styles.logoutButton}>
        Log Out
      </button>
    </div>
  );
};
export default HomePage;