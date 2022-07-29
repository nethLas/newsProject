import axios from 'axios';
const API_URL = '/api/v1/stories/';

const createStory = async (formData) => {
  const response = await axios.post(`${API_URL}`, formData);
  return response.data.data.data;
};
const getStory = async (slug) => {
  const response = await axios.get(`${API_URL}?slug=${slug}`);
  // console.log(response);
  return response.data.data.data[0];
};
const getStories = async ({ page = 1, limit = 2 }) => {
  const response = await axios.get(
    `${API_URL}?sort=-createdAt&page=${page}&limit=${limit}`
  );
  // if (response.data.data.results < limit)
  // console.log(response);
  return response.data.data.data;
};
const storiesService = {
  createStory,
  getStory,
  getStories,
};

export default storiesService;
