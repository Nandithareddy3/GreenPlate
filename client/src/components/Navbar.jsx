import React from 'react';
import { NavLink } from 'react-router-dom';
// 1. Make sure you import BiMessageRounded and remove BiBell
import { BiHomeAlt2, BiSearch, BiPlus, BiUser, BiMessageRounded } from 'react-icons/bi';
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
        <BiPlus size={28} />
      </NavLink>

      {/* 2. Make sure this NavLink goes to '/inbox' and uses BiMessageRounded */}
      <NavLink to="/inbox" className={getNavLinkClass}>
        <BiMessageRounded size={24} />
      </NavLink>

      <NavLink to="/profile" className={getNavLinkClass}>
        <BiUser size={24} />
      </NavLink>
    </nav>
  );
};
export default Navbar;