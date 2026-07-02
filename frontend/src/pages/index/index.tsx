import { useState } from "react";
import { View, Text, Input, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { aiParse } from "../../api";

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

      // 存缓存
      Taro.setStorageSync("aiResult", res);

      // 跳转
      Taro.navigateTo({ url: "/pages/result/index" });
    } catch (e) {
      Taro.showToast({ title: "解析失败", icon: "none" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        请输入维修问题
      </View>
      <Input
        style={{
          height: 100,
          border: "1px solid #ddd",
          borderRadius: 8,
          paddingLeft: 12,
          fontSize: 16
        }}
        placeholder="例如：空调不制冷"
        onInput={(e) => setText(e.detail.value)}
      />
      <Button
        style={{
          marginTop: 20,
          height: 48,
          borderRadius: 8,
          backgroundColor: "#1677ff",
          color: "#fff",
          fontSize: 18
        }}
        onClick={handleSubmit}
        loading={loading}
        disabled={loading}
      >
        立即分析
      </Button>
    </View>
  );
}
