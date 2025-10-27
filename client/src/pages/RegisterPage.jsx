import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Taker",
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
      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      alert(
        `Registration failed: ${
          error.response?.data?.message || "An error occurred"
        }`
      );
    }
  };

  return (
    // Reusing the same container styles as LoginPage
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Create Your Account
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Reusing the same input styles */}
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Your Name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
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
          minLength="6"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />

        {/* Tailwind styled radio button group */}
        <fieldset className="border border-gray-300 rounded-md overflow-hidden">
          <legend className="sr-only">Select your role</legend>
          <label
            className={`flex items-center p-3 cursor-pointer transition duration-150 ease-in-out ${
              role === "Taker"
                ? "bg-green-50 border-l-4 border-green-500"
                : "hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="Taker"
              checked={role === "Taker"}
              onChange={onChange}
              className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span>I want to find food (Taker)</span>
          </label>
          <label
            className={`flex items-center p-3 cursor-pointer transition duration-150 ease-in-out border-t border-gray-300 ${
              role === "Seller"
                ? "bg-green-50 border-l-4 border-green-500"
                : "hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="Seller"
              checked={role === "Seller"}
              onChange={onChange}
              className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span>I have surplus food (Seller)</span>
          </label>
        </fieldset>

        {/* Reusing the same button styles */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
        >
          Register
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-green-600 hover:text-green-500"
        >
          Log In
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
