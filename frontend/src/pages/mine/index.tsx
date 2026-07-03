import { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { ClipboardList, MapPin, MessageCircle, Settings, User, ChevronRight, LogOut } from "lucide-react";
import { getUserInfo } from "../../api";
import { Button, colors, font, spacing, shadows, radius } from "design-system";

const MENU_ITEMS = [
  { label: "我的订单", icon: <ClipboardList size={22} color={colors.primary[500]} />, url: "/pages/orders/index" },
  { label: "地址管理", icon: <MapPin size={22} color={colors.success} />, url: "/pages/index/index" },
  { label: "客服中心", icon: <MessageCircle size={22} color={colors.info} />, url: "/pages/index/index" },
  { label: "设置", icon: <Settings size={22} color={colors.warning} />, url: "/pages/index/index" },
];

export default function MinePage() {
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const loadUserInfo = async () => {
    const token = Taro.getStorageSync("token");
    if (!token) {
      Taro.redirectTo({ url: "/pages/login/index" });
      return;
    }

    setLoading(true);
    try {
      const res = await getUserInfo(token);
      setUser(res || {});
    } catch (e) {
      console.error("获取用户信息失败", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  const handleLogout = () => {
    Taro.showModal({
      title: "退出登录",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync("token");
          Taro.removeStorageSync("user");
          Taro.redirectTo({ url: "/pages/login/index" });
        }
      }
    });
  };

  const handleMenuClick = (url: string) => {
    if (url === "/pages/index/index") {
      Taro.showToast({ title: "功能开发中", icon: "none" });
    } else if (url) {
      Taro.navigateTo({ url });
    }
  };

  if (loading) {
    return (
      <View style={{ padding: spacing.md, textAlign: "center", minHeight: "100vh", backgroundColor: colors.gray[50] }}>
        <Text style={{ color: colors.gray[400] }}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={{ minHeight: "100vh", backgroundColor: colors.gray[50] }}>
      <View style={{ backgroundColor: colors.primary[500], padding: spacing.lg, paddingTop: 64 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
          <View style={{
            width: 88,
            height: 88,
            borderRadius: radius.full,
            backgroundColor: colors.gray[0],
            justifyContent: "center",
            alignItems: "center",
            boxShadow: shadows.level2
          }}>
            <User size={36} color={colors.primary[500]} />
          </View>
          <View>
            <Text style={{ fontSize: font.h3.size, color: colors.gray[0], fontWeight: font.h3.weight, marginBottom: spacing.xs, display: "block" }}>
              {user.name || "用户"}
            </Text>
            <Text style={{ fontSize: font.bodySmall.size, color: "rgba(var(--ds-white-rgb), 0.85)" }}>
              {user.phone || "-"}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ padding: spacing.md, marginTop: -spacing.md }}>
        <View style={{
          backgroundColor: colors.gray[0],
          borderRadius: radius.xl,
          overflow: "hidden",
          boxShadow: shadows.level1
        }}>
          {MENU_ITEMS.map((item, index) => (
            <View
              key={item.label}
              style={{
                padding: spacing.md,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: index < MENU_ITEMS.length - 1 ? `1px solid ${colors.gray[200]}` : "none"
              }}
              onClick={() => handleMenuClick(item.url)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                {item.icon}
                <Text style={{ fontSize: font.body.size, color: colors.gray[900] }}>{item.label}</Text>
              </View>
              <ChevronRight size={18} color={colors.gray[300]} />
            </View>
          ))}
        </View>

        <View style={{ marginTop: spacing.md }}>
          <Button
            variant="secondary"
            size="large"
            block
            style={{
              color: colors.danger,
              border: `1px solid ${colors.danger}`,
            }}
            icon={<LogOut size={16} />}
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </View>
      </View>
    </View>
  );
}
