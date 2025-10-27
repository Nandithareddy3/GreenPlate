import React, { useState, useEffect } from 'react';
import listingService from '../services/listingService';
import ListingCard from '../components/ListingCard';
import styles from './ExplorePage.module.css';
import Map from '../components/Map';

const ExplorePage = () => {
    const [listings, setListings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // We need a separate function for fetching that we can call anytime
    const fetchListings = async (keyword = '') => {
        setIsLoading(true);
        try {
            // Pass the keyword to the service
            const data = await listingService.getListings(keyword);
            setListings(data);
        } catch (error) {
            console.error("Failed to fetch listings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch all listings when the page first loads
    useEffect(() => {
        fetchListings();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchListings(searchTerm);
    };

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Explore & Search</h1>

            <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for bread, vegetables, etc..."
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>Search</button>
            </form>
            <div className={styles.mapContainer}>
                {!isLoading && <Map listings={listings} />}
            </div>

            {isLoading ? (
                <p className={styles.centered}>Loading...</p>
            ) : (
                <div className={styles.resultsGrid}>
                    {listings.length > 0 ? (
                        listings.map(listing => (
                            <ListingCard key={listing._id} listing={listing} />
                        ))
                    ) : (
                        <p className={styles.centered}>No listings found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExplorePage;