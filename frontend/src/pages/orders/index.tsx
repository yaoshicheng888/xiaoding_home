import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getOrderList } from "../../api";

const STATUS_MAP = {
  created: { label: "待接单", color: "#F59E0B" },
  assigned: { label: "已派单", color: "#2563EB" },
  accepted: { label: "已接单", color: "#22C55E" },
  doing: { label: "服务中", color: "#06B6D4" },
  completed: { label: "已完成", color: "#64748B" }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${month}月${day}日 ${hour}:${minute}`;
};

export default function OrderListPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const token = Taro.getStorageSync("token");
    if (!token) {
      Taro.redirectTo({ url: "/pages/login/index" });
      return;
    }

    setLoading(true);
    try {
      const res = await getOrderList(token);
      setOrders(res || []);
    } catch (e) {
      console.error("获取订单列表失败", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOrderClick = (orderId: number) => {
    Taro.setStorageSync("orderId", orderId);
    Taro.navigateTo({ url: "/pages/order/index" });
  };

  if (loading) {
    return (
      <View style={{ padding: 16, textAlign: "center", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
        <Text style={{ color: "#64748B" }}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16, minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <View style={{ fontSize: 22, fontWeight: 600, color: "#1E293B", marginBottom: 20 }}>
        我的订单
      </View>

      {orders.length === 0 ? (
        <View style={{ textAlign: "center", padding: 60, backgroundColor: "#FFFFFF", borderRadius: 16, boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
          <Text style={{ fontSize: 16, color: "#94A3B8" }}>暂无订单</Text>
        </View>
      ) : (
        <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => {
            const status = STATUS_MAP[order.status];
            return (
              <View
                key={order.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
                }}
                onClick={() => handleOrderClick(order.id)}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: 600, color: "#1E293B" }}>{order.category || "通用"}</Text>
                  <Text style={{ fontSize: 14, color: status?.color, fontWeight: 500 }}>
                    {status?.label || order.status}
                  </Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 14, color: "#475569" }}>{order.description}</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 12, color: "#94A3B8" }}>{formatDate(order.createdAt)}</Text>
                  <Text style={{ fontSize: 18, color: "#22C55E", fontWeight: 700 }}>
                    ¥{order.price}
                  </Text>
                </View>

                {order.provider && (
                  <View style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E2E8F0" }}>
                    <Text style={{ fontSize: 14, color: "#64748B" }}>
                      师傅：{order.provider.name}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}