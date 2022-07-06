import axios from 'axios';
const API_URL = '/api/v1/users/signup';

const signup = async (userData) => {
  const response = await axios.post(API_URL, userData);
  console.log(response);
  return response.data.data.user;
};
const authService = { signup };
export default authService;
