import { useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { createOrder } from "../../api";

const URGENCY_MAP = {
  high: "紧急",
  medium: "中等",
  low: "普通"
};

const CATEGORY_PRICE = {
  "空调维修": [80, 150],
  "疏通": [100, 200],
  "水管维修": [60, 130],
  "电路维修": [80, 150],
  "家电维修": [60, 130],
  "开锁": [50, 100],
  "通用": [60, 120]
};

export default function Result() {
  const data = Taro.getStorageSync("aiResult");
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    const token = Taro.getStorageSync("token");

    setLoading(true);
    try {
      const res = await createOrder(data.requestId, token);

      Taro.setStorageSync("orderId", res.orderId);

      Taro.redirectTo({ url: "/pages/order/index" });
    } catch (e) {
      Taro.showToast({ title: "下单失败", icon: "none" });
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <View style={{ padding: 16, minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
        <Text style={{ fontSize: 16, color: "#64748B" }}>未获取到解析结果</Text>
        <Button
          style={{
            height: 48,
            borderRadius: 12,
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            fontSize: 16,
            marginTop: 20
          }}
          onClick={() => Taro.redirectTo({ url: "/pages/index/index" })}
        >
          返回
        </Button>
      </View>
    );
  }

  const aiResult = data.aiResult || {};
  const priceRange = CATEGORY_PRICE[aiResult.category] || [60, 120];

  return (
    <View style={{ padding: 16, minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 600, color: "#1E293B" }}>AI解析结果</Text>
      </View>

      <View style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
      }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: "#64748B", fontSize: 14 }}>问题类型</Text>
          <Text style={{ display: "block", fontSize: 18, fontWeight: 600, color: "#1E293B", marginTop: 4 }}>
            {aiResult.category || "通用"}
          </Text>
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: "#64748B", fontSize: 14 }}>问题描述</Text>
          <Text style={{ display: "block", fontSize: 16, color: "#475569", marginTop: 4 }}>
            {aiResult.problem || "-"}
          </Text>
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: "#64748B", fontSize: 14 }}>紧急程度</Text>
          <Text style={{ display: "block", fontSize: 16, color: "#F59E0B", fontWeight: 500, marginTop: 4 }}>
            {URGENCY_MAP[aiResult.urgency] || aiResult.urgency || "-"}
          </Text>
        </View>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 16,
          borderTop: "1px solid #E2E8F0"
        }}>
          <Text style={{ fontSize: 16, color: "#475569" }}>预计费用</Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 26, color: "#22C55E", fontWeight: 700 }}>
              ¥{priceRange[0]}~{priceRange[1]}
            </Text>
            <Text style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>（参考）</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <Button
          style={{
            height: 52,
            borderRadius: 14,
            backgroundColor: "#FFFFFF",
            color: "#475569",
            fontSize: 16,
            fontWeight: 500,
            flex: 1,
            border: "1px solid #E2E8F0"
          }}
          onClick={() => Taro.navigateBack()}
        >
          重新输入
        </Button>
        <Button
          style={{
            height: 52,
            borderRadius: 14,
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: 600,
            flex: 1
          }}
          onClick={handleOrder}
          loading={loading}
          disabled={loading}
        >
          立即下单
        </Button>
      </View>
    </View>
  );
}