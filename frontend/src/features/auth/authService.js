import axios from 'axios';
const API_URL = '/api/v1/users/';

const signup = async (userData) => {
  const response = await axios.post(`${API_URL}signup`, userData);
  console.log(response);
  return response.data.data.user;
};
const login = async (userData) => {
  const response = await axios.post(`${API_URL}login`, userData);
  console.log(response);
  return response.data.data.user;
};
const checkUser = async () => {
  console.log('sending check request');
  const response = await axios.get(`${API_URL}check-user`);
  console.log(response);
  return response.data.data.user;
};
const logout = async () => {
  const response = await axios.get(`${API_URL}login`);
  return response.data.status;
};
const authService = { signup, checkUser, login, logout };

export default authService;
