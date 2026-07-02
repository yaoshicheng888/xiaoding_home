import { useState } from "react";
import { View, Text, Input, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { aiParse } from "../../api";

const SHORTCUTS = [
  { label: "空调维修", icon: "❄️", category: "空调维修" },
  { label: "水电维修", icon: "💧", category: "水电维修" },
  { label: "安装服务", icon: "🔧", category: "安装服务" },
  { label: "疏通清洗", icon: "🧹", category: "疏通" },
];

export default function Index() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      Taro.showToast({ title: "请输入维修问题", icon: "none" });
      return;
    }

    const token = Taro.getStorageSync("token");
    if (!token) {
      Taro.redirectTo({ url: "/pages/login/index" });
      return;
    }

    setLoading(true);
    try {
      const res = await aiParse(text, token);
      Taro.setStorageSync("aiResult", res);
      Taro.navigateTo({ url: "/pages/result/index" });
    } catch (e) {
      Taro.showToast({ title: "解析失败", icon: "none" });
    } finally {
      setLoading(false);
    }
  };

  const handleShortcutClick = (category: string) => {
    setText(category);
  };

  return (
    <View style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <View style={{ backgroundColor: "#1677ff", padding: 20, paddingTop: 40 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>小钉到家</Text>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", padding: 6, borderRadius: 4 }}>
            <Text style={{ color: "#fff", fontSize: 14 }}>📍 北京</Text>
          </View>
        </View>

        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
          <Input
            style={{
              height: 48,
              fontSize: 16,
              marginBottom: 12
            }}
            placeholder="请输入您的问题，例如：空调不制冷"
            onInput={(e) => setText(e.detail.value)}
            value={text}
          />
          <Button
            style={{
              height: 48,
              borderRadius: 8,
              backgroundColor: "#ff4d4f",
              color: "#fff",
              fontSize: 18,
              width: "100%"
            }}
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            一键呼叫师傅
          </Button>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16, display: "block" }}>快捷入口</Text>
        <View style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {SHORTCUTS.map((item) => (
            <View
              key={item.label}
              style={{
                width: "47%",
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 20,
                alignItems: "center",
                border: "1px solid #f0f0f0"
              }}
              onClick={() => handleShortcutClick(item.category)}
            >
              <Text style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</Text>
              <Text style={{ fontSize: 16 }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}