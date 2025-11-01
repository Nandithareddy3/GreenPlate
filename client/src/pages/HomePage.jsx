import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import StoryReel from '../components/StoryReel.jsx';
import ListingCard from '../components/ListingCard.jsx';
import SearchBar from '../components/SearchBar.jsx'; // 1. Import
import CategoryScroller from '../components/CategoryScroller.jsx'; // 1. Import
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { logout } = useAuth();
  const [allListings, setAllListings] = useState([]); // 2. Holds all listings
  const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  // 4. Fetch listings from the API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // This is a public route, no token needed
        const { data } = await axios.get('http://localhost:5000/api/listings');
        setAllListings(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);
const filteredListings = useMemo(() => {
    return allListings
      .filter((listing) => {
        // Category filter
        if (selectedCategory === 'All') return true;
        return listing.category === selectedCategory;
      })
      .filter((listing) => {
        // Search filter (checks title)
        if (searchTerm === '') return true;
        return listing.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [allListings, selectedCategory, searchTerm]);
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
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <Link to={`/listing/${listing._id}`} key={listing._id} className={styles.cardLink}>
                  <ListingCard listing={listing} />
                </Link>
              ))
            ) : (
              // 6. Show a message if no listings match
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