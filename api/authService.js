import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://10.0.2.2:5000/api';

const authService = {
  setAuthToken: async (token) => {
    if (token) {
      await AsyncStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      await AsyncStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  register: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
      });
      await authService.setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      await authService.setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  logout: async () => {
    await authService.setAuthToken(null);
  },

  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },
};

export default authService;