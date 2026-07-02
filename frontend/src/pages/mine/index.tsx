import { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
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
    if (url) {
      Taro.navigateTo({ url });
    }
  };

  if (loading) {
    return (
      <View style={{ padding: 20, textAlign: "center" }}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <View style={{ backgroundColor: "#1677ff", padding: 30, paddingTop: 50 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Text style={{ fontSize: 32 }}>👤</Text>
          </View>
          <View>
            <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold", marginBottom: 8, display: "block" }}>
              {user.name || "用户"}
            </Text>
            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              {user.phone || "-"}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          overflow: "hidden"
        }}>
          {MENU_ITEMS.map((item, index) => (
            <View
              key={item.label}
              style={{
                padding: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: index < MENU_ITEMS.length - 1 ? "1px solid #f0f0f0" : "none"
              }}
              onClick={() => handleMenuClick(item.url)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                <Text style={{ fontSize: 16 }}>{item.label}</Text>
              </View>
              <Text style={{ fontSize: 14, color: "#999" }}>›</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              textAlign: "center"
            }}
            onClick={handleLogout}
          >
            <Text style={{ fontSize: 16, color: "#ff4d4f" }}>退出登录</Text>
          </View>
        </View>
      </View>
    </View>
  );
}