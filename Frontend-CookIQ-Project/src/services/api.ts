// src/services/api.ts
import axiosClient from '../api/axiosClient';
import { User, Product, BlogPost, BlogCategory } from '../types';

export const authApi = {
  login: (email: string, password: string) => 
    axiosClient.post('/auth/login', { email, password }),
  
  register: (fullName: string, email: string, password: string) => 
    axiosClient.post('/auth/register', { fullName, email, password }),
  
  getUser: (id: string) => axiosClient.get<User>(`/auth/${id}`),
  getAllUsers: () => axiosClient.get<User[]>('/auth/all'),
  deleteUser: (id: string) => axiosClient.delete(`/auth/${id}`),

  updateProfile: (data: { fullName: string; avatarUrl: string }) => 
    axiosClient.put('/auth/profile/update', data),
};

export const productApi = {
  getAll: (page = 0, size = 20) => axiosClient.get(`/products?page=${page}&size=${size}`),
  getById: (id: string) => axiosClient.get(`/products/${id}`),
  create: (data: any) => axiosClient.post('/products/admin', data),
  update: (id: string, data: any) => axiosClient.put(`/products/admin/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/products/admin/${id}`),
};

export const blogApi = {
  getPublic: () => axiosClient.get<BlogPost[]>('/blog/public'),
  getPublicDetail: (id: string) => axiosClient.get<BlogPost>(`/blog/public/${id}`),
  getPending: () => axiosClient.get<BlogPost[]>('/blog/pending'),
  getApproved: () => axiosClient.get<BlogPost[]>('/blog/approved'),
  create: (data: { title: string; category: BlogCategory; coverImageUrl: string; content: string; authorId: string }) => 
    axiosClient.post('/blog/create', data),
  approve: (id: string) => axiosClient.post(`/blog/approve/${id}`),
  reject: (id: string) => axiosClient.delete(`/blog/reject/${id}`),
  deleteApproved: (id: string) => axiosClient.delete(`/blog/delete-approved/${id}`),
  addComment: (blogId: string, userId: string, content: string) => 
    axiosClient.post(`/blog/comment/${blogId}`, { userId, content }),
};

export const fileApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const orderApi = {
  // User tạo đơn hàng
  create: (data: any) => axiosClient.post('/orders/create', data),
  
  // User xem lịch sử đơn hàng của mình
  getMyOrders: () => axiosClient.get('/orders/my-orders'),
  
  // Admin xem tất cả đơn hàng
  getAllOrders: () => axiosClient.get('/orders/admin/all'),
  
  // Admin cập nhật trạng thái đơn (Duyệt, Giao hàng, Huỷ)
  updateStatus: (id: string, status: string) => 
    axiosClient.put(`/orders/admin/${id}/status?status=${status}`),
};