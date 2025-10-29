import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const MainLayout = () => {
  return (
    // This helper class adds padding so the navbar doesn't cover content
    <div className="main-content-padding"> 
      <Outlet /> {/* This renders the child page (e.g., HomePage) */}
      <Navbar />
    </div>
  );
};
export default MainLayout;