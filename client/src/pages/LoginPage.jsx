import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './AuthPage.module.css'; // A shared style file for auth pages

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, user, token } = useAuth();
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
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (token && user) return <Navigate to="/" replace />;

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Welcome Back!</h1>
        <p className={styles.subtitle}>Log in to continue sharing.</p>
        
        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email" id="email" type="email"
            value={formData.email} onChange={handleChange}
          />
          <Input
            label="Password" id="password" type="password"
            value={formData.password} onChange={handleChange}
          />
          <Button text="Login" isLoading={isLoading} />
        </form>

        <div className={styles.toggleLink}>
          <Link to="/register">Need an account? Sign Up</Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;