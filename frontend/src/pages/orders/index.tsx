import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { ClipboardList, Clock } from "lucide-react";
import { getOrderList } from "../../api";
import { colors, font, spacing, shadows, radius } from "design-system";

const STATUS_MAP = {
  created: { label: "待接单", color: colors.warning },
  assigned: { label: "已派单", color: colors.primary[500] },
  accepted: { label: "已接单", color: colors.success },
  doing: { label: "服务中", color: colors.info },
  completed: { label: "已完成", color: colors.gray[500] }
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
      <View style={{ padding: spacing.md, textAlign: "center", minHeight: "100vh", backgroundColor: colors.gray[50] }}>
        <Text style={{ color: colors.gray[400] }}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: spacing.md, minHeight: "100vh", backgroundColor: colors.gray[50] }}>
      <View style={{ fontSize: font.h3.size, fontWeight: font.h3.weight, color: colors.gray[900], marginBottom: spacing.lg, display: "flex", alignItems: "center", gap: spacing.sm }}>
        <ClipboardList size={24} color={colors.primary[500]} />
        我的订单
      </View>

      {orders.length === 0 ? (
        <View style={{ textAlign: "center", padding: spacing.xxl, backgroundColor: colors.gray[0], borderRadius: radius.xl, boxShadow: shadows.level1 }}>
          <Text style={{ fontSize: font.body.size, color: colors.gray[400] }}>暂无订单</Text>
        </View>
      ) : (
        <View style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
          {orders.map((order) => {
            const status = STATUS_MAP[order.status];
            return (
              <View
                key={order.id}
                style={{
                  backgroundColor: colors.gray[0],
                  borderRadius: radius.xl,
                  padding: spacing.xl,
                  boxShadow: shadows.level1
                }}
                onClick={() => handleOrderClick(order.id)}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md }}>
                  <Text style={{ fontSize: font.body.size, fontWeight: font.title.weight, color: colors.gray[900] }}>{order.category || "通用"}</Text>
                  <Text style={{ fontSize: font.caption.size, color: status?.color, fontWeight: fontWeights.medium }}>
                    {status?.label || order.status}
                  </Text>
                </View>

                <View style={{ marginBottom: spacing.md }}>
                  <Text style={{ fontSize: font.bodySmall.size, color: colors.gray[600] }}>{order.description}</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Clock size={12} color={colors.gray[400]} />
                    <Text style={{ fontSize: font.caption.size, color: colors.gray[400], marginLeft: spacing.xs }}>{formatDate(order.createdAt)}</Text>
                  </View>
                  <Text style={{ fontSize: font.h2.size, color: colors.success, fontWeight: font.h2.weight }}>
                    ¥{order.price}
                  </Text>
                </View>

                {order.provider && (
                  <View style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTop: `1px solid ${colors.gray[200]}` }}>
                    <Text style={{ fontSize: font.bodySmall.size, color: colors.gray[500] }}>
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

const fontWeights = {
  medium: 500,
};
