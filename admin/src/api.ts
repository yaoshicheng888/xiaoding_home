import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

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
  provider?: {
    id: number;
    name: string;
    phone: string;
    rating: number;
  };
}

export interface Provider {
  id: number;
  name: string;
  phone: string;
  rating: number;
  createdAt: string;
}

export const getOrders = async () => {
  const res = await api.get('/admin/orders');
  return res.data.data as Order[];
};

export const getOrderDetail = async (orderId: number) => {
  const res = await api.get(`/admin/orders?orderId=${orderId}`);
  return res.data.data as Order;
};

export const getProviders = async () => {
  const res = await api.get('/admin/providers');
  return res.data.data as Provider[];
};

export const autoDispatch = async (orderId: number) => {
  const res = await api.post('/admin/dispatch/auto', { orderId });
  return res.data;
};

export const manualDispatch = async (orderId: number, providerId: number) => {
  const res = await api.post('/admin/dispatch/manual', { orderId, providerId });
  return res.data;
};

export interface OrderStatusLog {
  id: number;
  orderId: number;
  fromStatus: string;
  toStatus: string;
  operator: string;
  remark: string;
  createdAt: string;
}

export const getOrderLogs = async (orderId: number) => {
  const res = await api.get(`/admin/orders/${orderId}/logs`);
  return res.data.data as OrderStatusLog[];
};
