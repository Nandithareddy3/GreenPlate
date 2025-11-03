import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ListingCardSmall from '../components/ListingCardSmall.jsx';
import styles from './ExplorePage.module.css';
import { BiCurrentLocation } from 'react-icons/bi';

// A helper component to move the map
const ChangeMapView = ({ coords }) => {
  const map = useMap();
  map.setView(coords, 13); // Set view to new coords with zoom 13
  return null;
};

const ExplorePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  // Default: Hyderabad. This will be updated by user's location
  const [mapCenter, setMapCenter] = useState([17.4375, 78.4439]); 

  // 1. Fetch ALL listings on initial load
  useEffect(() => {
    const fetchAllListings = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5000/api/listings');
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllListings();
  }, []);

  // 2. Function to get user's location and fetch nearby listings
  const findNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      
      // 3. Set map center to user's location
      setMapCenter([latitude, longitude]); 

      try {
        // 4. Call our new "nearme" API
        const { data } = await axios.get('http://localhost:5000/api/listings/nearme', {
          params: { latitude, longitude }
        });
        setListings(data); // Set feed to only nearby listings
      } catch (error) {
        console.error('Failed to fetch nearby listings:', error);
      } finally {
        setLoading(false);
      }
    }, () => {
      alert("Unable to retrieve your location.");
      setLoading(false);
    });
  };

  return (
    <div className={styles.container}>
      {/* 1. Interactive Map */}
      <div className={styles.mapContainer}>
        <MapContainer center={mapCenter} zoom={13} className={styles.map}>
          <ChangeMapView coords={mapCenter} /> {/* This component updates the map's view */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {listings.map(listing => (
            <Marker 
              key={listing._id}
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

      {/* 2. Grid Container */}
      <div className={styles.gridContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Explore</h2>
          {/* 5. The "Find Near Me" button */}
          <button className={styles.nearMeButton} onClick={findNearMe}>
            <BiCurrentLocation /> Near Me
          </button>
        </div>
        {loading ? (
          <p>Loading listings...</p>
        ) : (
          <div className={styles.listingGrid}>
            {listings.length > 0 ? (
              listings.map((listing) => (
                <ListingCardSmall key={listing._id} listing={listing} />
              ))
            ) : (
              <p className={styles.emptyMessage}>No listings found near you.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;