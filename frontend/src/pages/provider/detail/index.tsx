import { useState, useEffect } from 'react';
import { View, Text, Button, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { getAvailableOrders, takeOrder, startService, completeService, ProviderOrderInfo } from '../../../services/provider';
import './index.css';

const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
  created: { label: '待接单', color: '#ff9500', bgColor: '#fff4e5' },
  assigned: { label: '待确认', color: '#007aff', bgColor: '#e8f0fe' },
  accepted: { label: '已接单', color: '#34c759', bgColor: '#e6f9ed' },
  doing: { label: '服务中', color: '#007aff', bgColor: '#e8f0fe' },
  completed: { label: '已完成', color: '#8e8e93', bgColor: '#f0f0f0' },
};

export default function ProviderOrderDetail() {
  const router = useRouter();
  const orderId = Number(router.params?.id);
  const [order, setOrder] = useState<ProviderOrderInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState('');

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const res = await getAvailableOrders();
      const found = res.data.find((o) => o.id === orderId);
      if (found) {
        setOrder(found);
      } else {
        Taro.showToast({ title: '订单不存在', icon: 'none' });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${min}`;
  };

  const handleTakeOrder = async () => {
    if (!orderId) return;
    try {
      await takeOrder(orderId);
      Taro.showToast({ title: '接单成功', icon: 'success' });
      fetchOrder();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartService = async () => {
    if (!orderId) return;
    try {
      await startService(orderId);
      Taro.showToast({ title: '开始服务', icon: 'success' });
      fetchOrder();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteService = async () => {
    if (!orderId) return;
    try {
      await completeService(orderId, remark);
      Taro.showToast({ title: '服务完成', icon: 'success' });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoBack = () => {
    Taro.navigateBack();
  };

  if (loading || !order) {
    return (
      <View className="provider-detail-page">
        <View className="provider-detail-header">
          <Button className="provider-detail-back" onClick={handleGoBack}>← 返回</Button>
          <Text className="provider-detail-title">订单详情</Text>
          <Text></Text>
        </View>
        <View className="provider-detail-loading">
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  const statusInfo = statusMap[order.status] || statusMap.created;

  return (
    <View className="provider-detail-page">
      <View className="provider-detail-header">
        <Button className="provider-detail-back" onClick={handleGoBack}>← 返回</Button>
        <Text className="provider-detail-title">订单详情</Text>
        <Text></Text>
      </View>

      <View className="provider-detail-content">
        <View className="provider-detail-status-card">
          <Text className="provider-detail-status-label">订单状态</Text>
          <Text
            className="provider-detail-status-value"
            style={{ color: statusInfo.color, backgroundColor: statusInfo.bgColor }}
          >
            {statusInfo.label}
          </Text>
        </View>

        <View className="provider-detail-card">
          <Text className="provider-detail-card-title">服务信息</Text>
          <View className="provider-detail-row">
            <Text className="provider-detail-row-label">服务类目</Text>
            <Text className="provider-detail-row-value">{order.category}</Text>
          </View>
          <View className="provider-detail-row">
            <Text className="provider-detail-row-label">问题描述</Text>
            <Text className="provider-detail-row-value">{order.problem || order.description}</Text>
          </View>
          <View className="provider-detail-row">
            <Text className="provider-detail-row-label">订单金额</Text>
            <Text className="provider-detail-row-value price">¥{order.price}</Text>
          </View>
        </View>

        <View className="provider-detail-card">
          <Text className="provider-detail-card-title">客户信息</Text>
          <View className="provider-detail-row">
            <Text className="provider-detail-row-label">客户姓名</Text>
            <Text className="provider-detail-row-value">{order.user.name || '用户'}</Text>
          </View>
          <View className="provider-detail-row">
            <Text className="provider-detail-row-label">联系电话</Text>
            <Text className="provider-detail-row-value">{order.user.phone}</Text>
          </View>
          <View className="provider-detail-row">
            <Text className="provider-detail-row-label">所在城市</Text>
            <Text className="provider-detail-row-value">{order.user.city || '未知城市'}</Text>
          </View>
        </View>

        <View className="provider-detail-card">
          <Text className="provider-detail-card-title">订单信息</Text>
          <View className="provider-detail-row">
            <Text className="provider-detail-row-label">订单编号</Text>
            <Text className="provider-detail-row-value">#{order.id}</Text>
          </View>
          <View className="provider-detail-row">
            <Text className="provider-detail-row-label">下单时间</Text>
            <Text className="provider-detail-row-value">{formatDate(order.createdAt)}</Text>
          </View>
        </View>

        {(order.status === 'accepted' || order.status === 'doing') && (
          <View className="provider-detail-card">
            <Text className="provider-detail-card-title">服务备注</Text>
            <Textarea
              className="provider-detail-remark-input"
              value={remark}
              onInput={(e) => setRemark(e.detail.value)}
              placeholder="请输入服务备注（选填）"
              maxlength={500}
            />
          </View>
        )}
      </View>

      <View className="provider-detail-footer">
        {order.status === 'created' && (
          <Button className="provider-detail-btn primary" onClick={handleTakeOrder}>
            立即抢单
          </Button>
        )}
        {order.status === 'assigned' && (
          <Button className="provider-detail-btn primary" onClick={handleTakeOrder}>
            确认接单
          </Button>
        )}
        {order.status === 'accepted' && (
          <Button className="provider-detail-btn primary" onClick={handleStartService}>
            开始服务
          </Button>
        )}
        {order.status === 'doing' && (
          <Button className="provider-detail-btn success" onClick={handleCompleteService}>
            完成服务
          </Button>
        )}
        {order.status === 'completed' && (
          <Button className="provider-detail-btn disabled" disabled>
            已完成
          </Button>
        )}
      </View>
    </View>
  );
}
