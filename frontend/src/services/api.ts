import axios, { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      window.location.href = '/login';
    } else if (response?.status === 403) {
      toast.error('Bạn không có quyền truy cập tính năng này.');
    } else if (response?.status === 404) {
      toast.error('Không tìm thấy dữ liệu yêu cầu.');
    } else if (response?.status === 429) {
      toast.error('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
    } else if (response?.status >= 500) {
      toast.error('Lỗi server. Vui lòng thử lại sau.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Yêu cầu quá thời gian chờ. Vui lòng thử lại.');
    } else if (error.message === 'Network Error') {
      toast.error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
