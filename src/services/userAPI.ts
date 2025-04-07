import axios from 'axios';

const API_URL = 'http://localhost:6202';

export const userAPI = {
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  logout: `${API_URL}/api/auth/logout`,
  gets: `${API_URL}/api/users`,
  update: (id:Number) => `${API_URL}/api/users/${id}`,
  delete: (id:Number) => `${API_URL}/api/users/${id}`,
  get: (id:Number) => `${API_URL}/api/users/${id}`,
};