import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import listingService from "../services/listingService";
import storyService from "../services/storyService";
import ListingCard from "../components/ListingCard";
import StoryReel from "../components/StoryReel"; // We will refactor this component next

const HomePage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const listingData = await listingService.getListings();
        setListings(listingData);

        if (user) {
          const storyData = await storyService.getStories(user.token);
          setStories(storyData);
        } else {
          setStories([]);
        }
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    // Main page container
    <div className="pt-4 pb-20">
      {/* 'pt-4' adds padding at the top.
              'pb-20' adds padding at the bottom (h-16 for navbar + 4 for extra space)
              This ensures content doesn't get hidden behind the fixed navbar.
            */}

      {/* Story Reel Section */}
      {user && stories.length > 0 && <StoryReel stories={stories} />}

      {/* Main Feed Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 my-6">
        Appetite Feed
      </h1>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-gray-500 mt-12">Loading...</div>
      )}

      {/* Content Feed */}
      {!isLoading && (
        <div>
          {listings.length > 0 ? (
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))
          ) : (
            <p className="text-center text-gray-600 mt-12">
              No available listings right now. Be the first to post!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
