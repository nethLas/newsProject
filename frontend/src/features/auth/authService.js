import axios from 'axios';
const API_URL = '/api/v1/users/';

const signup = async (userData) => {
  const response = await axios.post(`${API_URL}signup`, userData);
  return response.data.data.user;
};
const login = async (userData) => {
  const response = await axios.post(`${API_URL}login`, userData);
  return response.data.data.user;
};
const checkUser = async () => {
  const response = await axios.get(`${API_URL}check-user`);
  return response.data.data.user;
};
const logout = async () => {
  const response = await axios.get(`${API_URL}login`);
  return response.data.status;
};
const updateUser = async (userData) => {
  const urlPath = Object.keys(userData).join(' ').includes('password')
    ? 'updateMyPassword'
    : 'updateMe';
  const response = await axios.patch(`${API_URL}${urlPath}`, userData);
  return response.data.data.user;
};
const forgotPassword = async (userData) => {
  const response = await axios.post(`${API_URL}forgotPassword`, userData);
  return response.data.message;
};
const resetPassword = async (userData) => {
  const { token, password, passwordConfirm } = userData;
  const response = await axios.patch(`${API_URL}resetPassword/${token}`, {
    password,
    passwordConfirm,
  });
  return response.data.data.user;
};
const authService = {
  signup,
  checkUser,
  login,
  logout,
  updateUser,
  forgotPassword,
  resetPassword,
};

export default authService;
