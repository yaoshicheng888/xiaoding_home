import { useState } from 'react';
import { View, Text, Input, Button, StyleSheet } from '@tarojs/components';
import { login } from '../../api';
import Taro from '@tarojs/taro';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || phone.length !== 11) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    setLoading(true);
    try {
      const data = await login(phone);
      Taro.setStorageSync('token', data.token);
      Taro.setStorageSync('user', JSON.stringify(data.user));
      Taro.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/home/index' });
      }, 1000);
    } catch (error) {
      Taro.showToast({ title: '登录失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>小钉到家</Text>
        <Text style={styles.logoSub}>专业家政维修服务</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>手机号</Text>
          <Input
            style={styles.input}
            placeholder="请输入手机号"
            value={phone}
            onChange={(e) => setPhone(e.detail.value)}
            type="number"
            maxlength={11}
          />
        </View>
        <Button
          style={styles.button}
          onClick={handleLogin}
          loading={loading}
          disabled={loading}
        >
          登录
        </Button>
        <Text style={styles.tip}>输入手机号即可登录</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 30,
  },
  logo: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 60,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1677ff',
    marginBottom: 10,
  },
  logoSub: {
    fontSize: 16,
    color: '#999',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    display: 'block',
  },
  input: {
    height: 48,
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: 0,
    paddingLeft: 16,
    fontSize: 16,
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1677ff',
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
  tip: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 16,
  },
});
