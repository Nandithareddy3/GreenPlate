import React from 'react';
import styles from './Input.module.css'; // Import the CSS module

const Input = ({ label, id, type, value, onChange, placeholder }) => {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className={styles.input}
      />
    </div>
  );
};
export default Input;