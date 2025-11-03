import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios'; // We need global axios to fetch public data
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import styles from './PostPage.module.css'; // We can reuse the same styles

const EditListingPage = () => {
  const { id: listingId } = useParams(); // Get listing ID from URL
  const { user, API } = useAuth(); // Use API (with token) for submitting
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null); // Start as null
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch the listing's current data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/listings/${listingId}`);
        
        // Security check: Make sure the current user is the seller
        if (user?._id !== data.seller._id) {
          setError("You are not authorized to edit this listing.");
          return;
        }
        
        // Format the date for the 'datetime-local' input
        const expiry = new Date(data.expiryDate).toISOString().slice(0, 16);
        
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          expiryDate: expiry,
          // We'll keep location simple for now
          latitude: data.location.coordinates[1], 
          longitude: data.location.coordinates[0],
        });

      } catch (err) {
        setError("Failed to load listing data.");
      }
    };
    
    // We must wait for 'user' to be loaded before fetching
    if (user) {
      fetchListing();
    }
  }, [listingId, user]); // Re-run if user or ID changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Handle the PUT request (update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // We don't need to re-upload the image, just send the text data
      // Our backend PUT route is built to only update fields that are sent
      await API.put(`http://localhost:5000/api/listings/${listingId}`, formData);

      // 3. Success! Go back to the profile page.
      navigate('/profile');

    } catch (err) {
      setError('Failed to update listing. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Show loading/error states
  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Error</h1>
        <p className={styles.errorBox}>{error}</p>
      </div>
    );
  }
  
  if (!formData) {
     return <div className={styles.container}><p>Loading listing...</p></div>;
  }

  // 4. Render the form
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Your Listing</h1>
      <form onSubmit={handleSubmit}>
        
        <p className={styles.note}>Image uploads cannot be edited at this time.</p>
        
        <Input
          label="Title"
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        
        <div className={styles.fieldWrapper}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="category" className={styles.label}>Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.selectInput}
          >
            <option value="Bakery & Breads">Bakery & Breads</option>
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Dairy & Eggs">Dairy & Eggs</option>
            <option value="Cooked Meals">Cooked Meals</option>
            <option value="Packaged Goods">Packaged Goods</option>
            <option value="Desserts & Sweets">Desserts & Sweets</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input
          label="Expiry Date & Time"
          id="expiryDate"
          type="datetime-local"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        />

        {error && <p className={styles.errorBox}>{error}</p>}

        <Button text="Update Listing" isLoading={isLoading} />
      </form>
    </div>
  );
};

export default EditListingPage;