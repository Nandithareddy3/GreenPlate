import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import storyService from '../services/storyService';
import styles from '../components/Form.module.css';

const CreateStoryPage = () => {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = new FormData();
        dataToSend.append('storyImage', image);
        dataToSend.append('caption', caption);

        try {
            await storyService.createStory(dataToSend, user.token);
            alert('Story posted successfully!');
            navigate('/');
        } catch (error) {
            alert(`Failed to post story: ${error.response?.data?.message || 'An error occurred'}`);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Create a New Story</h1>
            <form onSubmit={onSubmit}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Upload Image</label>
                <input
                    type="file"
                    className={styles.inputField}
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg, image/jpg"
                    required
                />

                <label style={{ display: 'block', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: '600' }}>Caption (Optional)</label>
                <input
                    type="text"
                    className={styles.inputField}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption..."
                />

                <button type="submit" className={styles.submitButton}>
                    Post Story
                </button>
            </form>
        </div>
    );
};

export default CreateStoryPage;