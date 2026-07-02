import { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getOrder } from "../../api";

const STATUS_MAP = {
  created: { label: "待接单", color: "#f59e0b" },
  assigned: { label: "已派单", color: "#3b82f6" },
  accepted: { label: "已接单", color: "#10b981" },
  doing: { label: "服务中", color: "#06b6d4" },
  completed: { label: "已完成", color: "#6b7280" }
};

const STATUS_FLOW = ["created", "assigned", "accepted", "doing", "completed"];

export default function OrderPage() {
  const [order, setOrder] = useState<any>({});

  const load = async () => {
    const token = Taro.getStorageSync("token");
    const orderId = Taro.getStorageSync("orderId");

    if (!orderId) return;

    try {
      const res = await getOrder(orderId, token);
      setOrder(res);
    } catch (e) {
      console.error("获取订单失败", e);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentIndex = STATUS_FLOW.indexOf(order.status || "created");

  return (
    <View style={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>订单状态</Text>
      </View>

      {/* 状态流程条 */}
      <View style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20
      }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {STATUS_FLOW.map((status, index) => {
            const isActive = index <= currentIndex;
            const info = STATUS_MAP[status];
            return (
              <View key={status} style={{ alignItems: "center", flex: 1 }}>
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: isActive ? info.color : "#ddd",
                  marginBottom: 8
                }} />
                <Text style={{
                  fontSize: 12,
                  color: isActive ? "#333" : "#999"
                }}>
                  {info.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 订单信息 */}
      <View style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20
      }}>
        <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#999" }}>订单ID</Text>
          <Text>#{order.id}</Text>
        </View>
        <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#999" }}>当前状态</Text>
          <Text style={{
            color: STATUS_MAP[order.status]?.color,
            fontWeight: "bold"
          }}>
            {STATUS_MAP[order.status]?.label || order.status}
          </Text>
        </View>
        <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#999" }}>服务类目</Text>
          <Text>{order.category || "-"}</Text>
        </View>
        <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#999" }}>问题描述</Text>
          <Text>{order.description || "-"}</Text>
        </View>
        <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#999" }}>师傅</Text>
          <Text>{order.provider?.name || "等待派单中..."}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#999" }}>价格</Text>
          <Text style={{ color: "#ff4d4f", fontWeight: "bold", fontSize: 18 }}>
            ¥{order.price}
          </Text>
        </View>
      </View>

      {order.status === "completed" && (
        <View style={{
          marginTop: 20,
          backgroundColor: "#f0f9ff",
          borderRadius: 8,
          padding: 16,
          textAlign: "center"
        }}>
          <Text style={{ color: "#10b981", fontSize: 16 }}>
            服务已完成
          </Text>
        </View>
      )}
    </View>
  );
}
