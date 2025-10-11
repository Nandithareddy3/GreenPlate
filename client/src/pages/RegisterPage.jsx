import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../components/Form.module.css'; // 1. Import our new form styles

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Taker',
    });

    const { name, email, password, role } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            alert('Registration successful!');
            navigate('/');
        } catch (error) {
            alert(`Registration failed: ${error.response?.data?.message || 'An error occurred'}`);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Create Your Account</h1>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    className={styles.inputField}
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Your Name"
                    required
                />
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
                    minLength="6"
                />

                <div className={styles.roleSelector}>
                    <label className={`${styles.roleOption} ${role === 'Taker' ? styles.selected : ''}`}>
                        <input type="radio" name="role" value="Taker" checked={role === 'Taker'} onChange={onChange} />
                        I want to find food (Taker)
                    </label>
                    <label className={`${styles.roleOption} ${role === 'Seller' ? styles.selected : ''}`}>
                        <input type="radio" name="role" value="Seller" checked={role === 'Seller'} onChange={onChange} />
                        I have surplus food (Seller)
                    </label>
                </div>

                <button type="submit" className={styles.submitButton}>Register</button>
            </form>

            <p className={styles.authLink}>
                Already have an account? <Link to="/login">Log In</Link>
            </p>
        </div>
    );
};

export default RegisterPage;