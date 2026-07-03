import http from "./http";

// ===== 类型定义 =====
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
  user?: { id: number; name: string; phone: string; city: string };
  provider?: { id: number; name: string; phone: string; rating: number };
}

export interface Provider {
  id: number;
  name: string;
  phone: string;
  rating: number;
  balance?: number;
  createdAt: string;
}

export interface User {
  id: number;
  phone: string;
  name: string;
  createdAt: string;
}

export interface Stats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  onlineProviders: number;
  abnormalOrders: number;
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  platformFee: number;
  providerIncome: number;
  status: string;
  createdAt: string;
  order?: Order;
}

export interface AfterSale {
  id: number;
  orderId: number;
  reason: string;
  status: string;
  freezeStatus: string;
  createdAt: string;
  order?: Order;
}

export interface OrderStatusLog {
  id: number;
  orderId: number;
  fromStatus: string;
  toStatus: string;
  operator: string;
  remark: string;
  createdAt: string;
}

// ===== API 函数 =====
export const getOrders = () => http.get<any, Order[]>("/admin/orders");
export const getProviders = () => http.get<any, Provider[]>("/admin/providers");
export const getUsers = () => http.get<any, User[]>("/admin/users");
export const getStats = () => http.get<any, Stats>("/admin/stats");
export const getPayments = () => http.get<any, Payment[]>("/admin/payments");
export const getAfterSales = () => http.get<any, AfterSale[]>("/admin/aftersales");
export const getOrderLogs = (orderId: number) =>
  http.get<any, OrderStatusLog[]>(`/admin/orders/${orderId}/logs`);
export const autoDispatch = (orderId: number) =>
  http.post("/admin/dispatch/auto", { orderId });
export const manualDispatch = (orderId: number, providerId: number) =>
  http.post("/admin/dispatch/manual", { orderId, providerId });

// ===== 状态映射 =====
export const statusMap: Record<string, { color: string; label: string }> = {
  created: { color: "orange", label: "待接单" },
  assigned: { color: "blue", label: "已派单" },
  accepted: { color: "green", label: "已接单" },
  doing: { color: "cyan", label: "服务中" },
  completed: { color: "gray", label: "已完成" },
};

export const paymentStatusMap: Record<string, { color: string; label: string }> = {
  pending: { color: "orange", label: "待支付" },
  paid: { color: "blue", label: "已支付" },
  settled: { color: "green", label: "已结算" },
  refunded: { color: "red", label: "已退款" },
};

export const afterSaleStatusMap: Record<string, { color: string; label: string }> = {
  pending: { color: "orange", label: "待处理" },
  processing: { color: "blue", label: "处理中" },
  resolved: { color: "green", label: "已解决" },
  rejected: { color: "red", label: "已拒绝" },
};
