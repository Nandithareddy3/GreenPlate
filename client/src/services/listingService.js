import axios from 'axios';

const API_URL = 'http://localhost:5000/api/listings/';

const createListing = async (listingData, token) => {
    const config = {
        headers: {
            // ✅ This header is crucial for file uploads with FormData
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    };

    // Axios will automatically handle the FormData object correctly
    const response = await axios.post(API_URL, listingData, config);
    return response.data;
};
const getListingById = async (listingId) => {
    const response = await axios.get(API_URL + listingId);
    return response.data;
};
const getListings = async (keyword = '') => {
    const response = await axios.get(`${API_URL}?keyword=${keyword}`);
    return response.data;
};
const listingService = {
    getListings,
    createListing,
    getListingById,
};
export default listingService;