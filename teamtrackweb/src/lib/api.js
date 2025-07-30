import axios from 'axios';

const api = axios.create({
  baseURL: '/api/employees', // proxy assumed in vite.config.js
});

export default api;
