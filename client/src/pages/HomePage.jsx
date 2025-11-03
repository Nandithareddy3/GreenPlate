import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import StoryReel from '../components/StoryReel.jsx';
import ListingCard from '../components/ListingCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CategoryScroller from '../components/CategoryScroller.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { logout } = useAuth();
  const [listings, setListings] = useState([]); // 1. Only one list needed now
  const [loading, setLoading] = useState(true);

  // 2. State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 3. This useEffect will now re-run whenever the filters change
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // 4. Pass filters to the API as query params
        const { data } = await axios.get('http://localhost:5000/api/listings', {
          params: {
            keyword: searchTerm,
            category: selectedCategory,
          }
        });
        setListings(data); // Set the filtered list from the backend
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, [searchTerm, selectedCategory]); // 5. Re-fetch on any filter change

  // 6. We no longer need the 'useMemo' filtering!
  // The 'listings' state is now always the correct filtered list.

  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <h1 className={styles.logo}>GreenPlate</h1>
      </div>

      <StoryReel />
      
      {/* These components now just update the state, triggering the useEffect */}
      <CategoryScroller 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <SearchBar onSearch={setSearchTerm} />

      <div className={styles.feedContainer}>
        <h2 className={styles.title}>Feed</h2>
        
        {loading ? (
          <p>Loading listings...</p>
        ) : (
          <div className={styles.listingGrid}>
            {listings.length > 0 ? (
              listings.map((listing) => (
                <Link to={`/listing/${listing._id}`} key={listing._id} className={styles.cardLink}>
                  <ListingCard listing={listing} />
                </Link>
              ))
            ) : (
              <p className={styles.emptyMessage}>No listings found. Try a different filter!</p>
            )}
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