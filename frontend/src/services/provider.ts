import request from '../utils/request';

export interface ProviderInfo {
  id: number;
  phone: string;
  name: string;
}

export interface ProviderOrderInfo {
  id: number;
  status: string;
  category: string;
  description: string;
  price: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
    phone: string;
    city: string;
  };
  problem: string;
}

export const providerLogin = (phone: string) => {
  return request<{ token: string; provider: ProviderInfo }>('/provider/login', {
    method: 'POST',
    data: { phone },
  });
};

export const getAvailableOrders = () => {
  return request<ProviderOrderInfo[]>('/provider/orders', {
    method: 'GET',
  });
};

export const takeOrder = (orderId: number) => {
  return request<{ orderId: number }>('/provider/take', {
    method: 'POST',
    data: { orderId },
  });
};

export const startService = (orderId: number) => {
  return request<{ orderId: number }>('/provider/start', {
    method: 'POST',
    data: { orderId },
  });
};

export const completeService = (orderId: number, remark?: string, images?: string[]) => {
  return request<{ orderId: number }>('/provider/complete', {
    method: 'POST',
    data: { orderId, remark, images },
  });
};
