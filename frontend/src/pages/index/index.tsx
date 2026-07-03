import { useState } from "react";
import { View, Text, Input, Button, Image } from "@tarojs/components";
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
  const [images, setImages] = useState<string[]>([]);

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 3 - images.length,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        setImages([...images, ...res.tempFilePaths]);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

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
    <View style={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <View style={{ backgroundColor: "#2563EB", padding: 16, paddingTop: 56 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 24, color: "#FFFFFF", fontWeight: 600 }}>小钉到家</Text>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", padding: "6px 12px", borderRadius: 20 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 14 }}>📍 北京</Text>
          </View>
        </View>

        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 24, padding: 16, boxShadow: "0 6px 20px rgba(37,99,235,0.15)" }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <View style={{ marginRight: 12, width: 24, height: 24, borderRadius: 6, backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 10, fontWeight: 600, color: "#2563EB" }}>AI</Text>
            </View>
            <Input
              style={{
                height: 48,
                fontSize: 16,
                flex: 1,
                color: "#1E293B"
              }}
              placeholder="描述您的问题，例如：空调不制冷"
              placeholderStyle={{ color: "#94A3B8" }}
              onInput={(e) => setText(e.detail.value)}
              value={text}
            />
            <View
              style={{
                marginLeft: 8,
                width: 48,
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F1F5F9",
                borderRadius: 12
              }}
              onClick={handleChooseImage}
            >
              <Text style={{ fontSize: 22 }}>📷</Text>
            </View>
          </View>
          {images.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {images.map((img, idx) => (
                <View key={idx} style={{ position: "relative" }}>
                  <Image src={img} style={{ width: 80, height: 80, borderRadius: 12 }} mode="aspectFill" />
                  <View
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: 12 }}>✕</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          <Text style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>
            支持文字、语音、图片输入
          </Text>
          <Button
            style={{
              height: 52,
              borderRadius: 14,
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: 600,
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

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 600, color: "#1E293B", marginBottom: 16, display: "block" }}>快捷入口</Text>
        <View style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {SHORTCUTS.map((item) => (
            <View
              key={item.label}
              style={{
                width: "47%",
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
                border: "1px solid #E2E8F0",
                boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
              }}
              onClick={() => handleShortcutClick(item.category)}
            >
              <Text style={{ fontSize: 36, marginBottom: 10 }}>{item.icon}</Text>
              <Text style={{ fontSize: 16, color: "#1E293B", fontWeight: 500 }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}