import { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { getAvailableOrders, takeOrder, ProviderOrderInfo } from '../../../services/provider';
import './index.css';

const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
  created: { label: '待接单', color: '#ff9500', bgColor: '#fff4e5' },
  assigned: { label: '待确认', color: '#007aff', bgColor: '#e8f0fe' },
  accepted: { label: '已接单', color: '#34c759', bgColor: '#e6f9ed' },
  doing: { label: '服务中', color: '#007aff', bgColor: '#e8f0fe' },
  completed: { label: '已完成', color: '#8e8e93', bgColor: '#f0f0f0' },
};

export default function ProviderOrders() {
  const [orders, setOrders] = useState<ProviderOrderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAvailableOrders();
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useDidShow(() => {
    fetchOrders();
  });

  useEffect(() => {
    const timer = setInterval(fetchOrders, 15000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hour}:${min}`;
  };

  const handleTakeOrder = async (orderId: number) => {
    try {
      await takeOrder(orderId);
      Taro.showToast({ title: '接单成功', icon: 'success' });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleViewDetail = (orderId: number) => {
    Taro.navigateTo({ url: `/pages/provider/detail?id=${orderId}` });
  };

  const handleLogout = () => {
    Taro.removeStorageSync('token');
    Taro.removeStorageSync('providerId');
    Taro.removeStorageSync('providerName');
    Taro.redirectTo({ url: '/pages/provider/login' });
  };

  return (
    <View className="provider-orders-page">
      <View className="provider-orders-header">
        <View className="provider-orders-header-left">
          <Text className="provider-orders-title">抢单大厅</Text>
          <Text className="provider-orders-count">共 {orders.length} 单</Text>
        </View>
        <Button className="provider-logout-btn" onClick={handleLogout}>
          退出
        </Button>
      </View>

      {loading && orders.length === 0 && (
        <View className="provider-empty-state">
          <Text className="provider-loading-icon">⏳</Text>
          <Text>加载中...</Text>
        </View>
      )}

      {!loading && orders.length === 0 && (
        <View className="provider-empty-state">
          <Text className="provider-empty-icon">📋</Text>
          <Text className="provider-empty-text">暂无可接单订单</Text>
          <Text className="provider-empty-desc">系统将自动刷新，耐心等待新订单</Text>
        </View>
      )}

      <ScrollView
        className="provider-order-list"
        scrollY
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={fetchOrders}
      >
        {orders.map((order) => {
          const statusInfo = statusMap[order.status] || statusMap.created;
          return (
            <View key={order.id} className="provider-order-card" onClick={() => handleViewDetail(order.id)}>
              <View className="provider-order-card-header">
                <Text className="provider-order-category">{order.category || '通用服务'}</Text>
                <Text
                  className="provider-order-status"
                  style={{ color: statusInfo.color, backgroundColor: statusInfo.bgColor }}
                >
                  {statusInfo.label}
                </Text>
              </View>

              <View className="provider-order-card-body">
                <Text className="provider-order-desc">{order.problem || order.description || '暂无描述'}</Text>
                <View className="provider-order-info-row">
                  <Text className="provider-order-info-icon">👤</Text>
                  <Text className="provider-order-info-value">{order.user.name || '用户'} · {order.user.phone}</Text>
                </View>
                <View className="provider-order-info-row">
                  <Text className="provider-order-info-icon">📍</Text>
                  <Text className="provider-order-info-value">{order.user.city || '未知城市'}</Text>
                </View>
                <View className="provider-order-info-row">
                  <Text className="provider-order-info-icon">⏰</Text>
                  <Text className="provider-order-info-value">{formatDate(order.createdAt)}</Text>
                </View>
              </View>

              <View className="provider-order-card-footer">
                <Text className="provider-order-price">¥{order.price}</Text>
                {(order.status === 'created' || order.status === 'assigned') && (
                  <Button className="provider-take-btn" onClick={(e) => { e.stopPropagation(); handleTakeOrder(order.id); }}>
                    {order.status === 'assigned' ? '确认接单' : '抢单'}
                  </Button>
                )}
                {(order.status === 'accepted' || order.status === 'doing') && (
                  <Button className="provider-action-btn" onClick={(e) => { e.stopPropagation(); handleViewDetail(order.id); }}>
                    查看详情
                  </Button>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
