import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import styles from './PostPage.module.css';

const PostPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    expiryDate: '',
    latitude: '17.4375', // Default test location
    longitude: '78.4439', // Default test location
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if user is not a seller
  if (user?.role !== 'Seller') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Access Denied</h1>
        <p>You must be a "Seller" to post new listings.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    // 1. We must use FormData because we are sending a file
    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('description', formData.description);
    postData.append('category', formData.category);
    postData.append('expiryDate', formData.expiryDate);
    postData.append('latitude', formData.latitude);
    postData.append('longitude', formData.longitude);
    postData.append('image', image); // The file object

    try {
      // 2. Send the FormData to the backend
      await axios.post('http://localhost:5000/api/listings', postData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
          Authorization: `Bearer ${token}`,
        },
      });

      // 3. Success! Go to the home page to see the new post.
      navigate('/');

    } catch (err) {
      setError('Failed to create listing. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Post a New Listing</h1>
      <form onSubmit={handleSubmit}>
        <ImageUpload onFileSelect={setImage} />
        
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
          type="datetime-local" // A built-in date/time picker
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        />
        
        {/* We'll hide location inputs for now, using defaults */}
        {/* <Input label="Latitude" id="latitude" ... /> */}
        {/* <Input label="Longitude" id="longitude" ... /> */}

        {error && <p className={styles.errorBox}>{error}</p>}

        <Button text="Post Listing" isLoading={isLoading} />
      </form>
    </div>
  );
};

export default PostPage;