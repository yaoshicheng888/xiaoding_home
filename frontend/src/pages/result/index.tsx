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
  "空调维修": 120,
  "疏通": 150,
  "水管维修": 100,
  "电路维修": 120,
  "家电维修": 100,
  "开锁": 80,
  "通用": 90
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
      <View style={{ padding: 20 }}>
        <Text>未获取到解析结果</Text>
        <Button onClick={() => Taro.redirectTo({ url: "/pages/index/index" })}>
          返回
        </Button>
      </View>
    );
  }

  const aiResult = data.aiResult || {};
  const price = CATEGORY_PRICE[aiResult.category] || 90;

  return (
    <View style={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>AI解析结果</Text>
      </View>

      <View style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20
      }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: "#999", fontSize: 14 }}>问题类型</Text>
          <Text style={{ display: "block", fontSize: 16, fontWeight: "bold", marginTop: 4 }}>
            {aiResult.category || "通用"}
          </Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: "#999", fontSize: 14 }}>问题描述</Text>
          <Text style={{ display: "block", fontSize: 16, marginTop: 4 }}>
            {aiResult.problem || "-"}
          </Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: "#999", fontSize: 14 }}>紧急程度</Text>
          <Text style={{ display: "block", fontSize: 16, marginTop: 4 }}>
            {URGENCY_MAP[aiResult.urgency] || aiResult.urgency || "-"}
          </Text>
        </View>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 12,
          borderTop: "1px solid #f0f0f0"
        }}>
          <Text style={{ fontSize: 16, color: "#666" }}>预估价格</Text>
          <Text style={{ fontSize: 24, color: "#ff4d4f", fontWeight: "bold" }}>
            ¥{price}
          </Text>
        </View>
      </View>

      <Button
        style={{
          height: 52,
          borderRadius: 8,
          backgroundColor: "#ff4d4f",
          color: "#fff",
          fontSize: 18
        }}
        onClick={handleOrder}
        loading={loading}
        disabled={loading}
      >
        立即下单
      </Button>
    </View>
  );
}
