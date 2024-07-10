// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Replace with your Laravel API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post('/register', {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};
