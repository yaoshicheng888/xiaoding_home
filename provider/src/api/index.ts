const BASE_URL = "/api";

const request = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, options);
  const json = await res.json();
  if (json.code !== 0) {
    throw new Error(json.message || "请求失败");
  }
  return json.data;
};

export const providerLogin = async (phone: string) => {
  return request("/provider/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });
};

export const getOrders = async (token: string) => {
  return request("/provider/orders", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const takeOrder = async (orderId: number, token: string) => {
  return request("/provider/take", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ orderId })
  });
};

export const startService = async (orderId: number, token: string) => {
  return request("/provider/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ orderId })
  });
};

export const completeOrder = async (orderId: number, token: string) => {
  return request("/provider/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ orderId, remark: "已完成维修" })
  });
};

export const getOrderDetail = async (orderId: number, token: string) => {
  return request(`/order/detail?orderId=${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getMyOrders = async (token: string) => {
  return request("/provider/my-orders", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getIncome = async (token: string) => {
  return request("/provider/income", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getStats = async (token: string) => {
  return request("/provider/stats", {
    headers: { Authorization: `Bearer ${token}` }
  });
};
