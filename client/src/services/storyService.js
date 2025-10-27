
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/stories/';

const createStory = async (storyData, token) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, storyData, config);
    return response.data;
};

const getStories = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const storyService = { createStory, getStories };
export default storyService;