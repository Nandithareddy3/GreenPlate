import axios from 'axios';
const API_URL = 'http://localhost:5000/api/claims/';
const createClaim = async (listingId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL + listingId, {}, config);
    return response.data;
};

const getMyClaims = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'myclaims', config);
    return response.data;
};

const getReceivedClaims = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'received', config);
    return response.data;
};
const updateClaimStatus = async (claimId, status, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + claimId, { status }, config);
    return response.data;
};

const claimService = {
    createClaim,
    getMyClaims,
    getReceivedClaims,
    updateClaimStatus,
};

export default claimService;