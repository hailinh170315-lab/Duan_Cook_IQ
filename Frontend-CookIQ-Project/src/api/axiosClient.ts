import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', // Đảm bảo backend chạy port 8080
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động thêm Token vào header nếu có
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor: Xử lý response (ví dụ: tự động logout nếu 401)
axiosClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Token hết hạn hoặc không hợp lệ -> Xóa token và logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Có thể redirect về login ở đây nếu cần
    // window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default axiosClient;