import { useEffect, useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getUserInfo } from "../../api";

const MENU_ITEMS = [
  { label: "我的订单", icon: "📋", url: "/pages/orders/index" },
  { label: "地址管理", icon: "📍", url: "/pages/index/index" },
  { label: "客服中心", icon: "💬", url: "/pages/index/index" },
  { label: "设置", icon: "⚙️", url: "/pages/index/index" },
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
      <View style={{ padding: 16, textAlign: "center", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
        <Text style={{ color: "#64748B" }}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <View style={{ backgroundColor: "#2563EB", padding: 24, paddingTop: 64 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
          <View>
            <Text style={{ fontSize: 22, color: "#FFFFFF", fontWeight: 600, marginBottom: 8, display: "block" }}>
              {user.name || "用户"}
            </Text>
            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
              {user.phone || "-"}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 16, marginTop: -16 }}>
        <View style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
        }}>
          {MENU_ITEMS.map((item, index) => (
            <View
              key={item.label}
              style={{
                padding: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: index < MENU_ITEMS.length - 1 ? "1px solid #E2E8F0" : "none"
              }}
              onClick={() => handleMenuClick(item.url)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                <Text style={{ fontSize: 16, color: "#1E293B" }}>{item.label}</Text>
              </View>
              <Text style={{ fontSize: 16, color: "#CBD5E1" }}>›</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 16 }}>
          <Button
            style={{
              height: 48,
              borderRadius: 12,
              backgroundColor: "#FFFFFF",
              color: "#EF4444",
              fontSize: 16,
              fontWeight: 500,
              border: "1px solid #EF4444"
            }}
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </View>
      </View>
    </View>
  );
}