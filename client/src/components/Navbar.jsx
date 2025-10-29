import React from 'react';
import { NavLink } from 'react-router-dom';
// 1. We've replaced BiPlusSquare with BiPlus
import { BiHomeAlt2, BiSearch, BiPlus, BiBell, BiUser } from 'react-icons/bi';
import styles from './Navbar.module.css';

const Navbar = () => {
  
  const getNavLinkClass = ({ isActive }) => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };

  return (
    <nav className={styles.bottomNavbar}>
      <NavLink to="/" className={getNavLinkClass}>
        <BiHomeAlt2 size={24} />
      </NavLink>

      <NavLink to="/explore" className={getNavLinkClass}>
        <BiSearch size={24} />
      </NavLink>

      <NavLink to="/post" className={getNavLinkClass}>
        {/* 2. We're using the new icon here */}
        <BiPlus size={28} /> {/* Made it slightly larger */}
      </NavLink>

      <NavLink to="/notifications" className={getNavLinkClass}>
        <BiBell size={24} />
      </NavLink>

      <NavLink to="/profile" className={getNavLinkClass}>
        <BiUser size={24} />
      </NavLink>
    </nav>
  );
};
export default Navbar;