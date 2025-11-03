import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import styles from './PostPage.module.css'; // We reuse the styles from PostPage

const EditProfilePage = () => {
  const { user, API, token, loading: authLoading } = useAuth(); // Get user and loading state
  const navigate = useNavigate();

  const [name, setName] = useState(null); // Start as null
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This effect fills the form once the user data is loaded
  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]); // Run this when 'user' is ready

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('image', image);
    }

    try {
      // Call the backend route we built
      await API.put('/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Profile updated! Please log in again to see all changes.');
      navigate('/login'); // Force re-login to refresh the user state

    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show a loading message while the user's name is not yet available
  if (authLoading || name === null) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Loading Profile...</h1>
      </div>
    );
  }

  // Render the form
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <ImageUpload onFileSelect={setImage} />
        <p className={styles.note}>Upload a new profile picture</p>
        
        <Input
          label="Your Name"
          id="name"
          type="text"
          name="name"
          value={name} // This is now pre-filled
          onChange={(e) => setName(e.target.value)}
        />
        
        {error && <p className={styles.errorBox}>{error}</p>}
        <Button text="Save Changes" isLoading={isLoading} />
      </form>
    </div>
  );
};

export default EditProfilePage;