// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../components/Form.module.css'; // 1. Import the same form styles

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/'); // Redirect to homepage on successful login
        } catch (error) {
            alert(`Login failed: ${error.response?.data?.message || 'Invalid credentials'}`);
        }
    };

    return (
        // 2. Apply the styles to the JSX
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Welcome Back!</h1>
            <form onSubmit={onSubmit}>
                <input
                    type="email"
                    className={styles.inputField}
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Your Email"
                    required
                />
                <input
                    type="password"
                    className={styles.inputField}
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Password"
                    required
                />
                <button type="submit" className={styles.submitButton}>
                    Log In
                </button>
            </form>
            <p className={styles.authLink}>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
};

export default LoginPage;