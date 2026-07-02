import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getOrderList } from "../../api";

const STATUS_MAP = {
  created: { label: "待接单", color: "#f59e0b" },
  assigned: { label: "已派单", color: "#3b82f6" },
  accepted: { label: "已接单", color: "#10b981" },
  doing: { label: "服务中", color: "#06b6d4" },
  completed: { label: "已完成", color: "#6b7280" }
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
      <View style={{ padding: 20, textAlign: "center" }}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20, minHeight: "100vh" }}>
      <View style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        我的订单
      </View>

      {orders.length === 0 ? (
        <View style={{ textAlign: "center", padding: 60, backgroundColor: "#f8f9fa", borderRadius: 12 }}>
          <Text style={{ fontSize: 16, color: "#999" }}>暂无订单</Text>
        </View>
      ) : (
        <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => {
            const status = STATUS_MAP[order.status];
            return (
              <View
                key={order.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  border: "1px solid #f0f0f0"
                }}
                onClick={() => handleOrderClick(order.id)}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>{order.category || "通用"}</Text>
                  <Text style={{ fontSize: 14, color: status?.color }}>
                    {status?.label || order.status}
                  </Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 14, color: "#666" }}>{order.description}</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 14, color: "#999" }}>{formatDate(order.createdAt)}</Text>
                  <Text style={{ fontSize: 18, color: "#ff4d4f", fontWeight: "bold" }}>
                    ¥{order.price}
                  </Text>
                </View>

                {order.provider && (
                  <View style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <Text style={{ fontSize: 14, color: "#999" }}>
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