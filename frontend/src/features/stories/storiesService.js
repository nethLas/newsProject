import axios from 'axios';
const API_URL = '/api/v1/stories/';

const createStory = async (formData) => {
  const response = await axios.post(`${API_URL}`, formData);
  return response.data.data.data;
};
const storiesService = {
  createStory,
};

export default storiesService;
