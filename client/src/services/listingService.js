import axios from 'axios';

const API_URL = 'http://localhost:5000/api/listings/';

const createListing = async (listingData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, listingData, config);
    return response.data;
};
const getListingById = async (listingId) => {
    const response = await axios.get(API_URL + listingId);
    return response.data;
};
const getListings = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};
const listingService = {
    getListings,
    createListing,
    getListingById,
};
export default listingService;