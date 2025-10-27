import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={styles.navbar}>
            <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                Home
            </NavLink>
            <NavLink to="/explore" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                Explore
            </NavLink>
            {user && user.role === 'Seller' && (
                <NavLink to="/post" className={`${styles.navItem} ${styles.postButton}`}>
                    Post
                </NavLink>
            )}
            {user ? (
                <>
                    <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        Profile
                    </NavLink>
                    <NavLink to="/claims" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        Claims
                    </NavLink>
                    <button onClick={handleLogout} className={styles.navItem}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        Login
                    </NavLink>
                    <NavLink to="/register" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        Register
                    </NavLink>
                </>
            )}
        </nav>
    );
};

export default Navbar;