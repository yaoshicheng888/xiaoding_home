import { useEffect, useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Check, Star, Phone, User, FileText, Clock } from "lucide-react";
import { getOrder } from "../../api";
import { colors, font, spacing, shadows, radius } from "design-system";

const STATUS_MAP = {
  created: { label: "待接单", color: colors.warning },
  assigned: { label: "已派单", color: colors.primary[500] },
  accepted: { label: "已接单", color: colors.success },
  doing: { label: "服务中", color: colors.info },
  completed: { label: "已完成", color: colors.gray[500] }
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
    <View style={{ padding: spacing.md, minHeight: "100vh", backgroundColor: colors.gray[50] }}>
      <View style={{ marginBottom: spacing.lg }}>
        <Text style={{ fontSize: font.h3.size, fontWeight: font.h3.weight, color: colors.gray[900] }}>订单状态</Text>
      </View>

      <View style={{
        backgroundColor: colors.gray[0],
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginBottom: spacing.lg,
        boxShadow: shadows.level1
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
                  borderRadius: radius.full,
                  backgroundColor: isActive ? info.color : colors.gray[300],
                  marginBottom: spacing.sm,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {isActive && <Check size={14} color={colors.gray[0]} />}
                </View>
                <Text style={{
                  fontSize: font.caption.size,
                  color: isActive ? colors.gray[900] : colors.gray[400],
                  fontWeight: isActive ? fontWeights.medium : font.body.weight
                }}>
                  {info.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{
        backgroundColor: colors.gray[0],
        borderRadius: radius.xl,
        padding: spacing.xl,
        boxShadow: shadows.level1
      }}>
        <View style={{ marginBottom: spacing.md, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: colors.gray[500] }}>订单ID</Text>
          <Text style={{ color: colors.primary[500], fontWeight: font.title.weight }}>#{order.id}</Text>
        </View>
        <View style={{ marginBottom: spacing.md, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: colors.gray[500] }}>当前状态</Text>
          <Text style={{
            color: STATUS_MAP[order.status]?.color,
            fontWeight: font.title.weight,
            fontSize: font.body.size
          }}>
            {STATUS_MAP[order.status]?.label || order.status}
          </Text>
        </View>
        <View style={{ marginBottom: spacing.md, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: colors.gray[500] }}>服务类目</Text>
          <Text style={{ color: colors.gray[900], fontWeight: fontWeights.medium }}>{order.category || "-"}</Text>
        </View>
        <View style={{ marginBottom: spacing.md, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: colors.gray[500] }}>问题描述</Text>
          <Text style={{ color: colors.gray[600] }}>{order.description || "-"}</Text>
        </View>
        <View style={{ marginBottom: spacing.md, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: colors.gray[500] }}>师傅</Text>
          <Text style={{ color: colors.gray[900], fontWeight: fontWeights.medium }}>{order.provider?.name || "等待派单中..."}</Text>
        </View>
        {order.provider?.phone && (
          <View style={{ marginBottom: spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: colors.gray[500] }}>师傅电话</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Phone size={14} color={colors.primary[500]} />
              <Text style={{ color: colors.primary[500], fontWeight: fontWeights.medium, marginLeft: spacing.xs }}>{order.provider.phone}</Text>
            </View>
          </View>
        )}
        {order.provider?.rating && (
          <View style={{ marginBottom: spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: colors.gray[500] }}>师傅评分</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Star size={14} color={colors.warning} fill={colors.warning} />
              <Text style={{ color: colors.warning, fontWeight: font.title.weight, marginLeft: spacing.xs }}>{order.provider.rating}</Text>
            </View>
          </View>
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.lg, borderTop: `1px solid ${colors.gray[200]}` }}>
          <Text style={{ color: colors.gray[500] }}>价格</Text>
          <Text style={{ color: colors.success, fontWeight: font.h2.weight, fontSize: font.h2.size }}>
            ¥{order.price}
          </Text>
        </View>
      </View>

      {order.status === "completed" && (
        <View style={{ marginTop: spacing.lg }}>
          <View style={{
            backgroundColor: `${colors.success}15`,
            borderRadius: radius.md,
            padding: spacing.md,
            alignItems: "center",
            marginBottom: spacing.md
          }}>
            <Text style={{ color: colors.success, fontSize: font.body.size, fontWeight: font.title.weight }}>
              服务已完成
            </Text>
          </View>
          <Button
            style={{
              height: 52,
              borderRadius: radius.lg,
              backgroundColor: colors.gray[0],
              color: colors.danger,
              fontSize: font.body.size,
              fontWeight: fontWeights.medium,
              border: `1px solid ${colors.danger}`
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

const fontWeights = {
  medium: 500,
};
