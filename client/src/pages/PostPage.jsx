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
    });

    const { user } = useAuth();
    const navigate = useNavigate();
    const { title, description, expiryDate } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await listingService.createListing(formData, user.token);
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
                    placeholder="Food Title (e.g., '10 Sourdough Bread Loaves')"
                    required
                />
                <textarea
                    className={styles.inputField}
                    name="description"
                    value={description}
                    onChange={onChange}
                    placeholder="Description (e.g., 'Freshly baked today, surplus from the morning shift.')"
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
                <button type="submit" className={styles.submitButton}>
                    Post Listing
                </button>
            </form>
        </div>
    );
};

export default PostPage;