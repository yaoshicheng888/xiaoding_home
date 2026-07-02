import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('provider_token');
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
    alert(message || '请求失败');
    return Promise.reject(new Error(message));
  },
  (error) => {
    alert(error.message || '网络错误');
    return Promise.reject(error);
  }
);

export interface ProviderInfo {
  id: number;
  phone: string;
  name: string;
  rating: number;
  balance: number;
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
  user?: {
    id: number;
    name: string;
    phone: string;
    city: string;
  };
}

export const login = async (phone: string) => {
  return api.post('/provider/login', { phone });
};

export const getAvailableOrders = async () => {
  return api.get('/provider/orders');
};

export const takeOrder = async (orderId: number) => {
  return api.post('/provider/take', { orderId });
};

export const startService = async (orderId: number) => {
  return api.post('/provider/start', { orderId });
};

export const completeService = async (orderId: number, remark?: string) => {
  return api.post('/provider/complete', { orderId, remark });
};

export const statusMap: Record<string, { label: string; color: string }> = {
  created: { label: '待接单', color: '#f59e0b' },
  assigned: { label: '已派单', color: '#3b82f6' },
  accepted: { label: '已接单', color: '#10b981' },
  doing: { label: '服务中', color: '#06b6d4' },
  completed: { label: '已完成', color: '#6b7280' },
};
