import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import listingService from "../services/listingService";

const PostPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expiryDate: "",
    latitude: "",
    longitude: "",
  });
  const [image, setImage] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { title, description, expiryDate, latitude, longitude } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          alert("Location captured!");
        },
        () =>
          alert(
            "Could not get your location. Please check your browser's location permissions."
          )
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    dataToSend.append("title", title);
    dataToSend.append("description", description);
    dataToSend.append("expiryDate", expiryDate);
    dataToSend.append("latitude", latitude);
    dataToSend.append("longitude", longitude);
    dataToSend.append("image", image);

    try {
      await listingService.createListing(dataToSend, user.token);
      alert("Listing created successfully!");
      navigate("/");
    } catch (error) {
      alert(
        `Failed to create listing: ${
          error.response?.data?.message || "An error occurred"
        }`
      );
    }
  };

  // Reusable input class string for consistency
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent";

  return (
    // Reusing the same container styles
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Post Your Surplus Food
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Input fields using the defined inputClass */}
        <input
          type="text"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Food Title (e.g., '10 Sourdough Loaves')"
          required
          className={inputClass}
        />
        <textarea
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          rows="4"
          className={inputClass} // Apply the same style to textarea
        />

        {/* Date Input with Label */}
        <div>
          <label
            htmlFor="expiryDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Expiry Date & Time
          </label>
          <input
            type="datetime-local"
            id="expiryDate"
            name="expiryDate"
            value={expiryDate}
            onChange={onChange}
            required
            className={inputClass}
          />
        </div>

        {/* Location Inputs with Label and Button */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="number"
              step="any"
              name="latitude"
              value={latitude}
              onChange={onChange}
              placeholder="Latitude"
              required
              className={inputClass}
            />
            <input
              type="number"
              step="any"
              name="longitude"
              value={longitude}
              onChange={onChange}
              placeholder="Longitude"
              required
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={handleGetLocation}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Get My Current Location
          </button>
        </div>

        {/* Image Input with Label */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/jpg"
            required
            className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100`}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
        >
          Post Listing
        </button>
      </form>
    </div>
  );
};

export default PostPage;
