import request from '../utils/request';

export interface OrderInfo {
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

export const createOrder = (requestId: number) => {
  return request<{ orderId: number }>('/order/create', {
    method: 'POST',
    data: { requestId },
  });
};

export const getOrderList = () => {
  return request<OrderInfo[]>('/order/list', {
    method: 'GET',
  });
};

export const getOrderDetail = (orderId: number) => {
  return request<OrderInfo>(`/order/detail?orderId=${orderId}`, {
    method: 'GET',
  });
};
