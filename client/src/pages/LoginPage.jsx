import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      alert(
        `Login failed: ${
          error.response?.data?.message || "Invalid credentials"
        }`
      );
    }
  };

  return (
    // Main container: Limits width, centers on page, adds vertical margin
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Welcome Back!
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Input Field: Full width, padding, border, rounded corners, focus styles */}
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Your Email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {/* Submit Button: Full width, padding, background color, text color, rounded, hover effect */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
        >
          Log In
        </button>
      </form>
      {/* Link to Register Page: Centered text, margin top, styled link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-green-600 hover:text-green-500"
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
