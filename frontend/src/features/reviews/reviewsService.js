import axios from 'axios';
const API_URL = '/api/v1/reviews/';

const getReview = async (userId, storyId) => {
  const response = await axios.get(
    `${API_URL}?story=${storyId}&user=${userId}`
  );
  return response.data.data?.data[0];
};
const createReview = async (userId, storyId, review) => {
  const response = await axios.post(`${API_URL}`, {
    story: storyId,
    rating: review,
    user: userId,
  });
  return response.data.data.data;
};
const updateReview = async (userId, storyId, review, reviewId) => {
  const response = await axios.patch(`${API_URL}/${reviewId}`, {
    story: storyId,
    rating: review,
    user: userId,
  });
  return response.data.data.data;
};

const reviewsService = {
  getReview,
  createReview,
  updateReview,
};

export default reviewsService;
