import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './AuthPage.module.css'; // Use the same shared style

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Taker',
  });
  const { register, user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (token && user) return <Navigate to="/" replace />;

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join the GreenPlate community.</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Your Name" id="name" type="text"
            value={formData.name} onChange={handleChange}
          />
          <div className={styles.selectWrapper}>
            <label className={styles.selectLabel}>I am a...</label>
            <select
              name="role" value={formData.role} onChange={handleChange}
              className={styles.selectInput}
            >
              <option value="Taker">Community Member (Taker)</option>
              <option value="Seller">Business (Seller)</option>
            </select>
          </div>
          <Input
            label="Email" id="email" type="email"
            value={formData.email} onChange={handleChange}
          />
          <Input
            label="Password" id="password" type="password"
            value={formData.password} onChange={handleChange}
          />
          <Button text="Sign Up" isLoading={isLoading} />
        </form>

        <div className={styles.toggleLink}>
          <Link to="/login">Already have an account? Log In</Link>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;