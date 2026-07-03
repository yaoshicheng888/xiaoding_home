import { useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Snowflake, Droplets, Wrench, Brush, Camera, MapPin, Sparkles, X } from "lucide-react";
import { aiParse } from "../../api";
import { Button, Input, colors, font, spacing, shadows, radius } from "design-system";

const SHORTCUTS = [
  { label: "空调维修", icon: <Snowflake size={32} color={colors.primary[500]} />, category: "空调维修" },
  { label: "水电维修", icon: <Droplets size={32} color={colors.info} />, category: "水电维修" },
  { label: "安装服务", icon: <Wrench size={32} color={colors.success} />, category: "安装服务" },
  { label: "疏通清洗", icon: <Brush size={32} color={colors.warning} />, category: "疏通" },
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
    <View style={{ minHeight: "100vh", backgroundColor: colors.gray[50] }}>
      <View style={{ backgroundColor: colors.primary[500], padding: spacing.md, paddingTop: 56 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg }}>
          <Text style={{ fontSize: font.h2.size, color: colors.gray[0], fontWeight: font.h2.weight }}>小钉到家</Text>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(var(--ds-white-rgb), 0.15)", padding: `${spacing.xs}px ${spacing.sm}px`, borderRadius: radius.xxl }}>
            <MapPin size={14} color={colors.gray[0]} />
            <Text style={{ color: colors.gray[0], fontSize: font.bodySmall.size, marginLeft: spacing.xs }}>北京</Text>
          </View>
        </View>

        <View style={{ backgroundColor: colors.gray[0], borderRadius: radius.xxl, padding: spacing.md, boxShadow: shadows.level2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
            <View style={{ marginRight: spacing.md, width: 24, height: 24, borderRadius: radius.sm, backgroundColor: colors.primary[50], display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={12} color={colors.primary[500]} />
            </View>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Input
                inputSize="large"
                placeholder="描述您的问题，例如：空调不制冷"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </View>
            <View
              style={{
                width: 52,
                height: 52,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.gray[100],
                borderRadius: radius.md
              }}
              onClick={handleChooseImage}
            >
              <Camera size={22} color={colors.gray[500]} />
            </View>
          </View>
          {images.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md }}>
              {images.map((img, idx) => (
                <View key={idx} style={{ position: "relative" }}>
                  <Image src={img} style={{ width: 80, height: 80, borderRadius: radius.md }} mode="aspectFill" />
                  <View
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 24,
                      height: 24,
                      borderRadius: radius.full,
                      backgroundColor: "rgba(var(--ds-black-rgb), 0.5)",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <X size={14} color={colors.gray[0]} />
                  </View>
                </View>
              ))}
            </View>
          )}
          <Text style={{ fontSize: font.caption.size, color: colors.gray[500], marginBottom: spacing.lg }}>
            支持文字、语音、图片输入
          </Text>
          <Button
            variant="primary"
            size="large"
            block
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            一键呼叫师傅
          </Button>
        </View>
      </View>

      <View style={{ padding: spacing.md }}>
        <Text style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900], marginBottom: spacing.md, display: "block" }}>快捷入口</Text>
        <View style={{ display: "flex", flexWrap: "wrap", gap: spacing.sm }}>
          {SHORTCUTS.map((item) => (
            <View
              key={item.label}
              style={{
                width: "47%",
                backgroundColor: colors.gray[0],
                borderRadius: radius.xl,
                padding: spacing.xl,
                alignItems: "center",
                border: `1px solid ${colors.gray[200]}`,
                boxShadow: shadows.level1
              }}
              onClick={() => handleShortcutClick(item.category)}
            >
              <View style={{ marginBottom: spacing.sm }}>{item.icon}</View>
              <Text style={{ fontSize: font.body.size, color: colors.gray[900], fontWeight: fontWeights.medium }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const fontWeights = {
  medium: 500,
};
