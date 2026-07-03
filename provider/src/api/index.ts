const BASE_URL = "/api";

const MOCK_ENABLED = true;

const mockProviderLogin = () => ({
  token: "mock_token_12345",
  provider: {
    id: 1,
    name: "张师傅",
    phone: "13800138000",
    avatar: "",
    rating: 4.9,
    completedOrders: 128
  }
});

const mockStats = () => ({
  todayOrders: 5,
  todayIncome: 380.50,
  pendingOrders: 2
});

const mockIncome = () => ({
  balance: 5280.00,
  totalIncome: 12580.00,
  settledIncome: 7300.00,
  pendingIncome: 1280.00
});

const mockOrders = () => ([
  { id: 1, type: "水电维修", address: "朝阳区望京SOHO T3", customerName: "李女士", customerPhone: "13900139000", price: 150, status: "pending", urgency: "high", createTime: "2024-01-15 10:30" },
  { id: 2, type: "家电清洗", address: "海淀区中关村软件园", customerName: "王先生", customerPhone: "13700137000", price: 200, status: "pending", urgency: "medium", createTime: "2024-01-15 10:15" },
  { id: 3, type: "管道疏通", address: "西城区金融街", customerName: "赵先生", customerPhone: "13600136000", price: 120, status: "pending", urgency: "low", createTime: "2024-01-15 09:45" },
  { id: 4, type: "空调维修", address: "东城区王府井", customerName: "孙女士", customerPhone: "13500135000", price: 300, status: "pending", urgency: "high", createTime: "2024-01-15 09:30" },
  { id: 5, type: "灯具安装", address: "丰台区方庄", customerName: "周先生", customerPhone: "13400134000", price: 80, status: "pending", urgency: "medium", createTime: "2024-01-15 09:00" }
]);

const mockMyOrders = () => ([
  { id: 101, type: "水电维修", address: "朝阳区三里屯", customerName: "刘女士", customerPhone: "13300133000", price: 180, status: "working", createTime: "2024-01-15 08:00", startTime: "2024-01-15 08:30" },
  { id: 102, type: "家电清洗", address: "海淀区五道口", customerName: "陈先生", customerPhone: "13200132000", price: 220, status: "completed", createTime: "2024-01-14 14:00", completedTime: "2024-01-14 16:30" },
  { id: 103, type: "管道疏通", address: "西城区德胜门", customerName: "杨女士", customerPhone: "13100131000", price: 100, status: "completed", createTime: "2024-01-14 10:00", completedTime: "2024-01-14 11:30" },
  { id: 104, type: "空调维修", address: "东城区崇文门", customerName: "黄先生", customerPhone: "13000130000", price: 350, status: "cancelled", createTime: "2024-01-13 15:00", cancelTime: "2024-01-13 15:30" }
]);

const mockOrderDetail = (orderId: number) => ({
  id: orderId,
  type: "水电维修",
  description: "卫生间水龙头漏水，需要更换",
  address: "朝阳区望京SOHO T3",
  customerName: "李女士",
  customerPhone: "13900139000",
  price: 150,
  status: "working",
  urgency: "high",
  createTime: "2024-01-15 10:30",
  startTime: "2024-01-15 11:00",
  providerName: "张师傅",
  providerPhone: "13800138000"
});

const request = async (url: string, options: RequestInit = {}) => {
  if (MOCK_ENABLED) {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (url === "/provider/login") return mockProviderLogin();
    if (url === "/provider/stats") return mockStats();
    if (url === "/provider/income") return mockIncome();
    if (url === "/provider/orders") return mockOrders();
    if (url === "/provider/my-orders") return mockMyOrders();
    if (url.startsWith("/order/detail")) {
      const match = url.match(/orderId=(\d+)/);
      return mockOrderDetail(match ? parseInt(match[1]) : 1);
    }
    if (url === "/provider/take") return {};
    if (url === "/provider/start") return {};
    if (url === "/provider/complete") return {};
  }
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
