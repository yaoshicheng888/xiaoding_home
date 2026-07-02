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
    <View style={{ padding: 40, paddingTop: 80 }}>
      <View style={{ textAlign: "center", marginBottom: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1677ff" }}>
          小钉到家
        </Text>
        <Text style={{ display: "block", fontSize: 14, color: "#999", marginTop: 8 }}>
          专业家政维修服务
        </Text>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Input
          style={{
            height: 48,
            border: "1px solid #ddd",
            borderRadius: 8,
            paddingLeft: 16,
            fontSize: 16
          }}
          placeholder="请输入手机号"
          type="number"
          maxlength={11}
          onInput={(e) => setPhone(e.detail.value)}
        />
      </View>
      <Button
        style={{
          height: 48,
          borderRadius: 8,
          backgroundColor: "#1677ff",
          color: "#fff",
          fontSize: 18
        }}
        onClick={handleLogin}
      >
        登录
      </Button>
      <Text style={{ display: "block", textAlign: "center", fontSize: 12, color: "#999", marginTop: 16 }}>
        输入手机号即可登录
      </Text>
    </View>
  );
}
