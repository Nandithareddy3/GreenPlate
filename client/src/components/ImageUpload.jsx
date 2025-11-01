import React, { useState } from 'react';
import styles from './ImageUpload.module.css';
import { BiImageAdd } from 'react-icons/bi';

const ImageUpload = ({ onFileSelect }) => {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set the file object for the parent form
      onFileSelect(file);
      
      // Create a URL for image preview
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles.wrapper}>
      <label htmlFor="image-upload" className={styles.uploadBox}>
        {preview ? (
          <img src={preview} alt="Preview" className={styles.previewImage} />
        ) : (
          <div className={styles.placeholder}>
            <BiImageAdd size={40} />
            <span>Click to upload image</span>
          </div>
        )}
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleChange}
        className={styles.input}
        required
      />
    </div>
  );
};

export default ImageUpload;