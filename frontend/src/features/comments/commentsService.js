import axios from 'axios';
const API_URL = '/api/v1/comments/';

const getComments = async (storyId) => {
  const response = await axios.get(`${API_URL}?story=${storyId}`);
  //   const response = await axios.get(//nested route
  //     `/api/v1/stories/${storyId}}/comments`
  //   );
  return response.data.data?.data;
};
const createComment = async (userId, storyId, comment) => {
  const response = await axios.post(`${API_URL}`, {
    story: storyId,
    comment,
    user: userId,
  });
  // const response = await axios.post(`/api/v1/stories/${storyId}}/comments`, { //nested route
  //   story: storyId,
  //   comment,
  //   user: userId,
  // });

  return response.data.data.data;
};
const commentsService = {
  getComments,
  createComment,
};

export default commentsService;
