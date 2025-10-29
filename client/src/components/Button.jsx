import React from 'react';
import styles from './Button.module.css'; // Import the CSS module

const Button = ({ text, type = 'submit', onClick, isLoading = false }) => {
  const buttonClass = `${styles.button} ${isLoading ? styles.loading : ''}`;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={buttonClass}
    >
      {isLoading ? 'Loading...' : text}
    </button>
  );
};
export default Button;