import React, { useState, useEffect } from 'react';
import listingService from '../services/listingService';
import ListingCard from '../components/ListingCard';

const HomePage = () => {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const data = await listingService.getListings();
                setListings(data);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, []);
    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center', fontFamily: 'Poppins' }}>Appetite Feed</h1>
            <div>
                {listings.length > 0 ? (
                    listings.map(listing => (
                        <ListingCard key={listing._id} listing={listing} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center' }}>No available listings right now. Be the first to post!</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;