import { useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Smartphone, Home } from "lucide-react";
import { login } from "../../api";
import { Button, Input } from "design-system";
import { colors, font, spacing, shadows, radius } from "design-system";

export default function Login() {
  const [phone, setPhone] = useState("");

  const handleLogin = async () => {
    if (!phone || phone.length !== 11) {
      Taro.showToast({ title: "请输入正确的手机号", icon: "none" });
      return;
    }
    try {
      const data = await login(phone);
      Taro.setStorageSync("token", data.token);
      Taro.setStorageSync("userId", data.user.id);
      Taro.showToast({ title: "登录成功", icon: "success" });
      setTimeout(() => {
        Taro.redirectTo({ url: "/pages/index/index" });
      }, 1000);
    } catch (e) {
      Taro.showToast({ title: "登录失败", icon: "none" });
    }
  };

  return (
    <View style={{ padding: spacing.xl, paddingTop: 100, minHeight: "100vh", backgroundColor: colors.gray[50] }}>
      <View style={{ textAlign: "center", marginBottom: 56 }}>
        <View style={{ marginBottom: spacing.md }}>
          <Home size={48} color={colors.primary[500]} />
        </View>
        <Text style={{ fontSize: font.display.size, fontWeight: font.display.weight, color: colors.primary[500] }}>
          小钉到家
        </Text>
        <Text style={{ display: "block", fontSize: font.bodySmall.size, color: colors.gray[500], marginTop: spacing.sm }}>
          专业家政维修服务
        </Text>
      </View>
      <View style={{
        backgroundColor: colors.gray[0],
        borderRadius: radius.xl,
        padding: spacing.xl,
        boxShadow: shadows.level1
      }}>
        <View style={{ marginBottom: spacing.lg }}>
          <Input
            inputSize="large"
            placeholder="请输入手机号"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={11}
          />
        </View>
        <Button
          variant="primary"
          size="large"
          block
          onClick={handleLogin}
          icon={<Smartphone size={18} />}
        >
          登录
        </Button>
      </View>
      <Text style={{ display: "block", textAlign: "center", fontSize: font.caption.size, color: colors.gray[400], marginTop: spacing.lg }}>
        输入手机号即可登录
      </Text>
    </View>
  );
}
