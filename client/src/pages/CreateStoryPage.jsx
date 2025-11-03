import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/Button.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
// We can reuse the same styles as the PostPage!
import styles from './PostPage.module.css'; 

const CreateStoryPage = () => {
  const { token, API } = useAuth();
  const navigate = useNavigate();

  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image for your story.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    // 1. We must use FormData for the file
    const postData = new FormData();
    postData.append('caption', caption);
    postData.append('image', image); // The file object

    try {
      // 2. Call the backend API we already built
      await API.post('http://localhost:5000/api/stories', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // 3. Success! Go to the home page to see the new story.
      navigate('/');

    } catch (err) {
      setError('Failed to create story. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Post a New Story</h1>
      <form onSubmit={handleSubmit}>
        <ImageUpload onFileSelect={setImage} />
        <p className={styles.note}>This story will be visible for 24 hours.</p>

        <div className={styles.fieldWrapper}>
          <label htmlFor="caption" className={styles.label}>Caption (Optional)</label>
          <textarea
            id="caption"
            name="caption"
            rows="2"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className={styles.textarea}
            placeholder="Add a caption..."
          />
        </div>
        
        {error && <p className={styles.errorBox}>{error}</p>}

        <Button text="Post Story" isLoading={isLoading} />
      </form>
    </div>
  );
};

export default CreateStoryPage;