import axios from 'axios';
const API_URL = 'http://localhost:5000/api/users/';
const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);
    return response.data;
};
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);
    return response.data;
};
const getProfile = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'profile', config);
    return response.data;
};
const followUser = async (userId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    // The body is empty for this PUT request
    const response = await axios.put(API_URL + `${userId}/follow`, null, config);
    return response.data;
};

const authService = {
    register,
    login,
    getProfile,
    followUser,
};
export default authService;