import { useEffect, useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getOrder } from "../../api";

const STATUS_MAP = {
  created: { label: "待接单", color: "#F59E0B" },
  assigned: { label: "已派单", color: "#2563EB" },
  accepted: { label: "已接单", color: "#22C55E" },
  doing: { label: "服务中", color: "#06B6D4" },
  completed: { label: "已完成", color: "#64748B" }
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
    <View style={{ padding: 16, minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 600, color: "#1E293B" }}>订单状态</Text>
      </View>

      <View style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
      }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          {STATUS_FLOW.map((status, index) => {
            const isActive = index <= currentIndex;
            const info = STATUS_MAP[status];
            return (
              <View key={status} style={{ alignItems: "center", flex: 1 }}>
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: isActive ? info.color : "#CBD5E1",
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {isActive && <Text style={{ color: "#FFFFFF", fontSize: 12 }}>✓</Text>}
                </View>
                <Text style={{
                  fontSize: 12,
                  color: isActive ? "#1E293B" : "#94A3B8",
                  fontWeight: isActive ? 500 : 400
                }}>
                  {info.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
      }}>
        <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#64748B" }}>订单ID</Text>
          <Text style={{ color: "#2563EB", fontWeight: 600 }}>#{order.id}</Text>
        </View>
        <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#64748B" }}>当前状态</Text>
          <Text style={{
            color: STATUS_MAP[order.status]?.color,
            fontWeight: 600,
            fontSize: 16
          }}>
            {STATUS_MAP[order.status]?.label || order.status}
          </Text>
        </View>
        <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#64748B" }}>服务类目</Text>
          <Text style={{ color: "#1E293B", fontWeight: 500 }}>{order.category || "-"}</Text>
        </View>
        <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#64748B" }}>问题描述</Text>
          <Text style={{ color: "#475569" }}>{order.description || "-"}</Text>
        </View>
        <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#64748B" }}>师傅</Text>
          <Text style={{ color: "#1E293B", fontWeight: 500 }}>{order.provider?.name || "等待派单中..."}</Text>
        </View>
        {order.provider?.phone && (
          <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "#64748B" }}>师傅电话</Text>
            <Text style={{ color: "#2563EB", fontWeight: 500 }}>{order.provider.phone}</Text>
          </View>
        )}
        {order.provider?.rating && (
          <View style={{ marginBottom: 12, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "#64748B" }}>师傅评分</Text>
            <Text style={{ color: "#F59E0B", fontWeight: 600 }}>⭐ {order.provider.rating}</Text>
          </View>
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid #E2E8F0" }}>
          <Text style={{ color: "#64748B" }}>价格</Text>
          <Text style={{ color: "#22C55E", fontWeight: 700, fontSize: 20 }}>
            ¥{order.price}
          </Text>
        </View>
      </View>

      {order.status === "completed" && (
        <View style={{ marginTop: 20 }}>
          <View style={{
            backgroundColor: "#ECFDF5",
            borderRadius: 12,
            padding: 16,
            textAlign: "center",
            marginBottom: 16
          }}>
            <Text style={{ color: "#22C55E", fontSize: 16, fontWeight: 600 }}>
              服务已完成
            </Text>
          </View>
          <Button
            style={{
              height: 52,
              borderRadius: 14,
              backgroundColor: "#FFFFFF",
              color: "#EF4444",
              fontSize: 16,
              fontWeight: 500,
              border: "1px solid #EF4444"
            }}
            onClick={() => {
              Taro.showToast({ title: "售后申请已提交", icon: "none" });
            }}
          >
            申请售后
          </Button>
        </View>
      )}
    </View>
  );
}