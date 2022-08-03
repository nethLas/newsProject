import axios from 'axios';
const API_URL = '/api/v1/stories/';

const createStory = async (formData) => {
  const response = await axios.post(`${API_URL}`, formData);
  return response.data.data.data;
};
const updateStory = async (formData, storyId) => {
  const response = await axios.patch(`${API_URL}${storyId}`, formData);
  return response.data.data.data;
};
const getStory = async (slug) => {
  const response = await axios.get(`${API_URL}?slug=${slug}`);
  // console.log(response);
  if (response.data.results === 0)
    throw new Error("Uh oh, We couldn't find that story");
  return response.data.data.data[0];
};
const getStories = async ({ page = 1, limit = 2 }) => {
  const response = await axios.get(
    `${API_URL}?sort=-createdAt&page=${page}&limit=${limit}`
  );
  return response.data.data.data;
};
const getUserStories = async (userId) => {
  const response = await axios.get(`/api/v1/users/${userId}/stories`);
  return response.data.data.data;
};
const deleteStory = async function (storyId) {
  await axios.delete(`${API_URL}${storyId}`);
  return storyId;
};
const loadMoreStories = async ({ skip, limit = 10 }) => {
  const response = await axios.get(
    `${API_URL}?sort=-createdAt&skip=${skip}&limit=${limit}`
  );
  return [response.data.data.data, response.data.results === limit];
};
const storiesService = {
  createStory,
  getStory,
  deleteStory,
  getStories,
  loadMoreStories,
  updateStory,
  getUserStories,
};

export default storiesService;
