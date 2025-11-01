import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ListingCardSmall from '../components/ListingCardSmall.jsx';
import styles from './ExplorePage.module.css';

const ExplorePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userLocation = [17.4375, 78.4439]; // Default: Hyderabad

  useEffect(() => {
    const fetchListings = async () => {
      try {
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
    <div className={styles.container}>
      {/* 1. Interactive Map */}
      <div className={styles.mapContainer}>
        <MapContainer center={userLocation} zoom={13} className={styles.map}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {/* Loop through listings and add a marker for each */}
          {listings.map(listing => (
            <Marker 
              key={listing._id}
              // Coordinates are [longitude, latitude] in GeoJSON
              position={[listing.location.coordinates[1], listing.location.coordinates[0]]}
            >
              <Popup>
                <Link to={`/listing/${listing._id}`} className={styles.popupLink}>
                  <strong>{listing.title}</strong>
                  <p>{listing.seller?.name || 'Seller'}</p>
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* 2. 2-Column Grid */}
      <div className={styles.gridContainer}>
        <h2 className={styles.title}>Explore Nearby</h2>
        {loading ? (
          <p>Loading listings...</p>
        ) : (
          <div className={styles.listingGrid}>
            {listings.map((listing) => (
              <ListingCardSmall key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;