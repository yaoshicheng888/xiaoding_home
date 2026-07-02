import { useState } from 'react';
import { View, Text, Textarea, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { createRequest, AiParseResult } from '../../services/ai';
import { createOrder } from '../../services/order';
import { userLogin } from '../../services/user';
import './index.css';

const statusMap: Record<string, { label: string; color: string }> = {
  created: { label: '待接单', color: '#ff9500' },
  assigned: { label: '已派单', color: '#007aff' },
  accepted: { label: '已接单', color: '#34c759' },
  doing: { label: '服务中', color: '#007aff' },
  completed: { label: '已完成', color: '#8e8e93' },
};

const quickServices = ['空调不制冷', '马桶堵了', '水管漏水', '电路跳闸', '开锁'];

export default function Index() {
  const [text, setText] = useState('');
  const [aiResult, setAiResult] = useState<AiParseResult | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderId: number;
    status: string;
    category: string;
    price: number;
  } | null>(null);
  const [phone, setPhone] = useState('13800000001');
  const [showLogin, setShowLogin] = useState(true);

  const handleQuickClick = (val: string) => {
    setText(val);
    setAiResult(null);
    setOrderResult(null);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await userLogin(phone);
      Taro.setStorageSync('token', res.data.token);
      Taro.setStorageSync('userId', res.data.user.id);
      setShowLogin(false);
      Taro.showToast({ title: '登录成功', icon: 'success' });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleParse = async () => {
    if (!text.trim()) {
      Taro.showToast({ title: '请输入维修问题', icon: 'none' });
      return;
    }
    try {
      setLoading(true);
      const res = await createRequest(text.trim());
      setAiResult(res.data.aiResult);
      setRequestId(res.data.requestId);
      setOrderResult(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!requestId) return;
    try {
      setLoading(true);
      const res = await createOrder(requestId);
      setOrderResult({
        orderId: res.data.orderId,
        status: 'created',
        category: aiResult?.category || '',
        price: 0,
      });
      Taro.showToast({ title: '下单成功', icon: 'success' });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/order/index' });
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const urgencyMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
  };

  if (showLogin) {
    return (
      <View className="login-page">
        <View className="login-header">
          <Text className="login-logo">🔧</Text>
          <Text className="login-title">小钉到家</Text>
          <Text className="login-subtitle">AI驱动的上门服务平台</Text>
        </View>
        <View className="login-form">
          <Text className="login-label">手机号登录</Text>
          <Input
            className="login-input"
            type="number"
            value={phone}
            maxlength={11}
            onInput={(e) => setPhone(e.detail.value)}
            placeholder="请输入手机号"
          />
          <Button
            className="login-btn"
            loading={loading}
            onClick={handleLogin}
          >
            登录 / 注册
          </Button>
          <Text className="login-tip">未注册手机号将自动创建账号</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="home-page">
      <View className="header">
        <Text className="logo">🔧 小钉到家</Text>
        <Text className="location">📍 北京</Text>
      </View>

      <View className="main-card">
        <Text className="card-title">描述您的问题</Text>
        <Text className="card-desc">一句话告诉我们需要什么服务，AI 智能匹配师傅</Text>

        <Textarea
          className="input-box"
          value={text}
          onInput={(e) => {
            setText(e.detail.value);
            setAiResult(null);
            setOrderResult(null);
          }}
          placeholder="例如：空调不制冷、马桶堵了、水管漏水..."
          maxlength={200}
        />

        <View className="quick-services">
          <Text className="quick-label">试试这些：</Text>
          <View className="quick-list">
            {quickServices.map((item) => (
              <View
                key={item}
                className="quick-tag"
                onClick={() => handleQuickClick(item)}
              >
                {item}
              </View>
            ))}
          </View>
        </View>

        <Button
          className="primary-btn"
          loading={loading}
          onClick={handleParse}
        >
          智能解析
        </Button>
      </View>

      {aiResult && (
        <View className="result-card">
          <View className="result-header">
            <Text className="result-icon">🤖</Text>
            <Text className="result-title">AI 智能解析结果</Text>
          </View>

          <View className="result-row">
            <Text className="result-label">服务类目</Text>
            <Text className="result-value category">{aiResult.category}</Text>
          </View>

          <View className="result-row">
            <Text className="result-label">问题描述</Text>
            <Text className="result-value">{aiResult.problem}</Text>
          </View>

          <View className="result-row">
            <Text className="result-label">紧急程度</Text>
            <Text className={`result-value urgency-${aiResult.urgency}`}>
              {urgencyMap[aiResult.urgency] || aiResult.urgency}
            </Text>
          </View>

          <View className="result-row">
            <Text className="result-label">服务标签</Text>
            <View className="tag-list">
              {aiResult.tags.map((tag) => (
                <Text key={tag} className="tag">{tag}</Text>
              ))}
            </View>
          </View>

          {!orderResult && (
            <Button
              className="order-btn"
              loading={loading}
              onClick={handleCreateOrder}
            >
              立即下单
            </Button>
          )}

          {orderResult && (
            <View className="order-success">
              <Text className="success-icon">✅</Text>
              <Text className="success-text">下单成功！正在为您匹配师傅...</Text>
              <Text className="order-id">订单号：{orderResult.orderId}</Text>
            </View>
          )}
        </View>
      )}

      <View className="footer-tip">
        <Text>师傅将在接单后联系您 · 服务满意再付款</Text>
      </View>
    </View>
  );
}
