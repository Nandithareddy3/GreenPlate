import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import listingService from '../services/listingService';
import styles from '../components/Form.module.css';

const PostPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        expiryDate: '',
        latitude: '',
        longitude: '',
    });
    const [image, setImage] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { title, description, expiryDate, latitude, longitude } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => setImage(e.target.files[0]);

    // Function to get user's current location
    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prev) => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }));
                    alert("Location captured!");
                },
                () => alert("Could not get your location. Please check your browser's location permissions.")
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = new FormData();

        // ✅ Append ALL form fields to the FormData object
        dataToSend.append('title', title);
        dataToSend.append('description', description);
        dataToSend.append('expiryDate', expiryDate);
        dataToSend.append('latitude', latitude);
        dataToSend.append('longitude', longitude);
        dataToSend.append('image', image);

        try {
            await listingService.createListing(dataToSend, user.token);
            alert('Listing created successfully!');
            navigate('/');
        } catch (error) {
            alert(`Failed to create listing: ${error.response?.data?.message || 'An error occurred'}`);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Post Your Surplus Food</h1>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    className={styles.inputField}
                    name="title"
                    value={title}
                    onChange={onChange}
                    placeholder="Food Title (e.g., '10 Sourdough Loaves')"
                    required
                />
                <textarea
                    className={styles.inputField}
                    name="description"
                    value={description}
                    onChange={onChange}
                    placeholder="Description"
                    required
                    rows="4"
                />
                <label style={{ marginBottom: '0.5rem', display: 'block' }}>Expiry Date & Time</label>
                <input
                    type="datetime-local"
                    className={styles.inputField}
                    name="expiryDate"
                    value={expiryDate}
                    onChange={onChange}
                    required
                />

                {/* ✅ ADDED LOCATION INPUTS AND BUTTON */}
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600' }}>Pickup Location</label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={latitude}
                        onChange={onChange}
                        placeholder="Latitude"
                        required
                        className={styles.inputField}
                    />
                    <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={longitude}
                        onChange={onChange}
                        placeholder="Longitude"
                        required
                        className={styles.inputField}
                    />
                </div>
                <button type="button" onClick={handleGetLocation} className={styles.secondaryButton}>
                    Get My Current Location
                </button>

                <label style={{ display: 'block', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: '600' }}>Upload Image</label>
                <input
                    type="file"
                    className={styles.inputField}
                    name="image"
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg, image/jpg"
                    required
                />

                <button type="submit" className={styles.submitButton}>
                    Post Listing
                </button>
            </form>
        </div>
    );
};

export default PostPage;