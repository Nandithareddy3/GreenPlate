import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineMapPin } from "react-icons/hi2";

const ListingCard = ({ listing }) => {
  const getExpiryInfo = (dateString) => {
    const expiry = new Date(dateString);
    const now = new Date();
    const diffHours = (expiry - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return <span className="text-red-600 font-medium">Expired</span>;
    }
    if (diffHours < 24) {
      return (
        <span className="text-red-500 font-medium">
          Expires in {Math.round(diffHours)}h
        </span>
      );
    }
    return <span className="text-gray-500">{expiry.toLocaleDateString()}</span>;
  };

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="block w-full max-w-xl mx-auto mb-6 bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1"
    >
      <div>
        <img
          className="w-full h-56 object-cover"
          src={
            listing.imageUrl ||
            "https://placehold.co/600x400/A8D8B9/4A4A4A?text=GreenPlate"
          }
          alt={listing.title}
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          {/* Title and Seller Info */}
          <div>
            <p className="text-sm font-semibold text-green-600">
              {listing.seller.name}
            </p>
            <h3 className="text-xl font-bold text-gray-900 truncate">
              {listing.title}
            </h3>
          </div>
          {/* Expiry Date */}
          <div className="text-sm flex-shrink-0 ml-2">
            {getExpiryInfo(listing.expiryDate)}
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4">
          {listing.description.substring(0, 100)}
          {listing.description.length > 100 ? "..." : ""}
        </p>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500">
          <HiOutlineMapPin className="mr-1" />
          <span>Secunderabad (Approx. location)</span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
