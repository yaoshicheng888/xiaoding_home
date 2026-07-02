import axios from 'axios';
import Taro from '@tarojs/taro';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = Taro.getStorageSync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data;
    if (code === 0) {
      return data;
    }
    Taro.showToast({ title: message || '请求失败', icon: 'none' });
    return Promise.reject(new Error(message));
  },
  (error) => {
    Taro.showToast({ title: error.message || '网络错误', icon: 'none' });
    return Promise.reject(error);
  }
);

export interface UserInfo {
  id: number;
  phone: string;
  name?: string;
  city?: string;
}

export interface AiResult {
  category: string;
  problem: string;
  urgency: string;
}

export interface Order {
  id: number;
  requestId?: number;
  userId: number;
  providerId?: number;
  status: string;
  category?: string;
  description?: string;
  price: number;
  commission: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
  provider?: {
    id: number;
    name: string;
    phone: string;
    rating: number;
  };
}

export const login = async (phone: string) => {
  return api.post('/user/login', { phone });
};

export const createRequest = async (text: string) => {
  return api.post('/request/create', { text });
};

export const createOrder = async (requestId: number) => {
  return api.post('/order/create', { requestId });
};

export const getOrderList = async () => {
  return api.get('/order/list');
};

export const getOrderDetail = async (orderId: number) => {
  return api.get('/order/detail', { params: { orderId } });
};

export const statusMap: Record<string, { label: string; color: string }> = {
  created: { label: '待接单', color: '#f59e0b' },
  assigned: { label: '已派单', color: '#3b82f6' },
  accepted: { label: '已接单', color: '#10b981' },
  doing: { label: '服务中', color: '#06b6d4' },
  completed: { label: '已完成', color: '#6b7280' },
};
