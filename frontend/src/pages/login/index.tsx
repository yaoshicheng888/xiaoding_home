import { useState } from "react";
import { View, Text, Input, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { login } from "../../api";

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
    <View style={{ padding: 40, paddingTop: 100, minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <View style={{ textAlign: "center", marginBottom: 56 }}>
        <Text style={{ fontSize: 32, fontWeight: 700, color: "#2563EB" }}>
          小钉到家
        </Text>
        <Text style={{ display: "block", fontSize: 14, color: "#64748B", marginTop: 8 }}>
          专业家政维修服务
        </Text>
      </View>
      <View style={{ marginBottom: 24 }}>
        <Input
          style={{
            height: 52,
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            paddingLeft: 20,
            fontSize: 16,
            color: "#1E293B",
            backgroundColor: "#FFFFFF"
          }}
          placeholder="请输入手机号"
          placeholderStyle={{ color: "#94A3B8" }}
          type="number"
          maxlength={11}
          onInput={(e) => setPhone(e.detail.value)}
        />
      </View>
      <Button
        style={{
          height: 52,
          borderRadius: 14,
          backgroundColor: "#2563EB",
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: 600
        }}
        onClick={handleLogin}
      >
        登录
      </Button>
      <Text style={{ display: "block", textAlign: "center", fontSize: 12, color: "#94A3B8", marginTop: 20 }}>
        输入手机号即可登录
      </Text>
    </View>
  );
}