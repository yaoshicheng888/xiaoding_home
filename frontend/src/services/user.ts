import request from '../utils/request';

export interface UserInfo {
  id: number;
  phone: string;
  name?: string;
  avatar?: string;
  city?: string;
}

export const userLogin = (phone: string) => {
  return request<{ token: string; user: { id: number; phone: string } }>('/user/login', {
    method: 'POST',
    data: { phone },
  });
};

export const getUserInfo = () => {
  return request<UserInfo>('/user/info', {
    method: 'GET',
  });
};
