import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  HiOutlineHome,
  HiOutlineMap,
  HiOutlinePlusCircle,
  HiOutlineBell,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineLogin,
} from "react-icons/hi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center transition-colors ${
      isActive ? "text-green-500" : "text-gray-500 hover:text-green-500"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-white flex justify-around items-center border-t border-gray-200 z-50">
      <NavLink to="/" className={navLinkClass}>
        <HiOutlineHome size={28} />
        <span className="text-xs">Home</span>
      </NavLink>

      <NavLink to="/explore" className={navLinkClass}>
        <HiOutlineMap size={28} />
        <span className="text-xs">Explore</span>
      </NavLink>

      {user && user.role === "Seller" && (
        <NavLink to="/post" className="text-green-500 hover:text-green-600">
          <HiOutlinePlusCircle size={36} />
        </NavLink>
      )}

      {user ? (
        <>
          <NavLink to="/notifications" className={navLinkClass}>
            <HiOutlineBell size={28} />
            <span className="text-xs">Alerts</span>
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            <HiOutlineUserCircle size={28} />
            <span className="text-xs">Profile</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-gray-500 hover:text-red-500 transition-colors"
          >
            <HiOutlineLogout size={28} />
            <span className="text-xs">Logout</span>
          </button>
        </>
      ) : (
        <NavLink to="/login" className={navLinkClass}>
          <HiOutlineLogin size={28} />
          <span className="text-xs">Login</span>
        </NavLink>
      )}
    </nav>
  );
};

export default Navbar;
