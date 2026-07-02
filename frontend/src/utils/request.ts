import Taro from '@tarojs/taro';

const BASE_URL = process.env.TARO_ENV === 'h5' ? '/api' : 'http://localhost:3000/api';

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

const request = <T = any>(url: string, options: Taro.request.Option = {}): Promise<ApiResponse<T>> => {
  const token = Taro.getStorageSync('token') || '';
  return new Promise((resolve, reject) => {
    Taro.request({
      url: BASE_URL + url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.header,
      },
      success: (res) => {
        const data = res.data as ApiResponse<T>;
        if (data.code === 0) {
          resolve(data);
        } else {
          Taro.showToast({ title: data.message || '请求失败', icon: 'none' });
          reject(new Error(data.message));
        }
      },
      fail: (err) => {
        Taro.showToast({ title: '网络错误', icon: 'none' });
        reject(err);
      },
    });
  });
};

export default request;
export { BASE_URL };
