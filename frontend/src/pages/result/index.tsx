import { useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Sparkles, RotateCcw, CheckCircle, AlertTriangle } from "lucide-react";
import { createOrder } from "../../api";
import { Button, colors, font, spacing, shadows, radius } from "design-system";

const URGENCY_MAP = {
  high: { label: "紧急", color: colors.danger },
  medium: { label: "中等", color: colors.warning },
  low: { label: "普通", color: colors.success }
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
      <View style={{ padding: spacing.md, minHeight: "100vh", backgroundColor: colors.gray[50] }}>
        <Text style={{ fontSize: font.body.size, color: colors.gray[400] }}>未获取到解析结果</Text>
        <Button
          variant="primary"
          size="large"
          style={{ marginTop: spacing.lg }}
          onClick={() => Taro.redirectTo({ url: "/pages/index/index" })}
        >
          返回
        </Button>
      </View>
    );
  }

  const aiResult = data.aiResult || {};
  const priceRange = CATEGORY_PRICE[aiResult.category] || [60, 120];
  const urgency = URGENCY_MAP[aiResult.urgency];

  return (
    <View style={{ padding: spacing.md, minHeight: "100vh", backgroundColor: colors.gray[50] }}>
      <View style={{ marginBottom: spacing.lg, display: "flex", alignItems: "center", gap: spacing.sm }}>
        <Sparkles size={24} color={colors.primary[500]} />
        <Text style={{ fontSize: font.h3.size, fontWeight: font.h3.weight, color: colors.gray[900] }}>AI解析结果</Text>
      </View>

      <View style={{
        backgroundColor: colors.gray[0],
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginBottom: spacing.lg,
        boxShadow: shadows.level1
      }}>
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={{ color: colors.gray[500], fontSize: font.bodySmall.size }}>问题类型</Text>
          <Text style={{ display: "block", fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900], marginTop: spacing.xs }}>
            {aiResult.category || "通用"}
          </Text>
        </View>
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={{ color: colors.gray[500], fontSize: font.bodySmall.size }}>问题描述</Text>
          <Text style={{ display: "block", fontSize: font.body.size, color: colors.gray[600], marginTop: spacing.xs }}>
            {aiResult.problem || "-"}
          </Text>
        </View>
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={{ color: colors.gray[500], fontSize: font.bodySmall.size }}>紧急程度</Text>
          <View style={{ display: "flex", alignItems: "center", marginTop: spacing.xs }}>
            <AlertTriangle size={16} color={urgency?.color || colors.gray[500]} />
            <Text style={{ display: "block", fontSize: font.body.size, color: urgency?.color || colors.gray[500], fontWeight: fontWeights.medium, marginLeft: spacing.xs }}>
              {urgency?.label || aiResult.urgency || "-"}
            </Text>
          </View>
        </View>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: spacing.lg,
          borderTop: `1px solid ${colors.gray[200]}`
        }}>
          <Text style={{ fontSize: font.body.size, color: colors.gray[600] }}>预计费用</Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: font.h2.size, color: colors.success, fontWeight: font.h2.weight }}>
              ¥{priceRange[0]}~{priceRange[1]}
            </Text>
            <Text style={{ fontSize: font.caption.size, color: colors.gray[400], marginTop: spacing.xxs }}>（参考）</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <Button
          variant="secondary"
          size="large"
          style={{ flex: 1 }}
          icon={<RotateCcw size={16} />}
          onClick={() => Taro.navigateBack()}
        >
          重新输入
        </Button>
        <Button
          variant="primary"
          size="large"
          style={{ flex: 1 }}
          icon={<CheckCircle size={16} />}
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

const fontWeights = {
  medium: 500,
};