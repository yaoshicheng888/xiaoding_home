const BASE_URL = "/api";

export const login = async (phone: string) => {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });
  const json = await res.json();
  return json.data;
};

export const aiParse = async (text: string, token: string) => {
  const res = await fetch(`${BASE_URL}/request/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  const json = await res.json();
  return json.data;
};

export const createOrder = async (requestId: number, token: string) => {
  const res = await fetch(`${BASE_URL}/order/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ requestId })
  });
  const json = await res.json();
  return json.data;
};

export const getOrder = async (orderId: number, token: string) => {
  const res = await fetch(`${BASE_URL}/order/detail?orderId=${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const json = await res.json();
  return json.data;
};
