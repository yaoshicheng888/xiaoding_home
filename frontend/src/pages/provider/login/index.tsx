import { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { providerLogin } from '../../../services/provider';
import './index.css';

export default function ProviderLogin() {
  const [phone, setPhone] = useState('13900000001');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim()) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    try {
      setLoading(true);
      const res = await providerLogin(phone.trim());
      Taro.setStorageSync('token', res.data.token);
      Taro.setStorageSync('providerId', res.data.provider.id);
      Taro.setStorageSync('providerName', res.data.provider.name);
      Taro.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/provider/orders' });
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="provider-login-page">
      <View className="provider-login-header">
        <Text className="provider-login-logo">👷</Text>
        <Text className="provider-login-title">小钉到家·师傅端</Text>
        <Text className="provider-login-subtitle">接单赚钱，轻松服务</Text>
      </View>
      <View className="provider-login-form">
        <Text className="provider-login-label">手机号登录</Text>
        <Input
          className="provider-login-input"
          type="number"
          value={phone}
          maxlength={11}
          onInput={(e) => setPhone(e.detail.value)}
          placeholder="请输入手机号"
        />
        <Button
          className="provider-login-btn"
          loading={loading}
          onClick={handleLogin}
        >
          登录 / 注册
        </Button>
        <Text className="provider-login-tip">未注册手机号将自动创建账号</Text>
      </View>
    </View>
  );
}
