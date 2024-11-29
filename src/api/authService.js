import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.56.1:5000/api'; 

const authService = {
  async register(name, email, password) {
    try {
      console.log('Registro:', { name, email, password });
      return { message: 'Registro exitoso' };

    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el registro');
    }
  },

  async login(email, password) {
    try {
      // Por ahora, simularemos el login
      console.log('Login simulado:', { email, password });
      const mockToken = 'mock-token-123';
      const mockUser = {
        id: '1',
        name: 'Usuario de Prueba',
        email: email
      };
      
      await AsyncStorage.setItem('userToken', mockToken);
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
      
      return { token: mockToken, user: mockUser };
      
      /*const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      const { token, user } = response.data;
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      return response.data;*/
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  },
  async logout() {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  },
  async isLoggedIn() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }
};


export default authService;