import { useState, useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { getOrderList, OrderInfo } from '../../services/order';
import './index.css';

const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
  created: { label: '待接单', color: '#ff9500', bgColor: '#fff4e5' },
  assigned: { label: '已派单', color: '#007aff', bgColor: '#e8f0fe' },
  accepted: { label: '已接单', color: '#34c759', bgColor: '#e6f9ed' },
  doing: { label: '服务中', color: '#007aff', bgColor: '#e8f0fe' },
  completed: { label: '已完成', color: '#8e8e93', bgColor: '#f0f0f0' },
};

export default function OrderPage() {
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrderList();
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useDidShow(() => {
    fetchOrders();
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hour}:${min}`;
  };

  const goHome = () => {
    Taro.switchTab({ url: '/pages/index/index' });
  };

  return (
    <View className="order-page">
      <View className="order-header">
        <Text className="order-title">我的订单</Text>
        <Text className="order-count">共 {orders.length} 单</Text>
      </View>

      {loading && orders.length === 0 && (
        <View className="empty-state">
          <Text className="loading-icon">⏳</Text>
          <Text>加载中...</Text>
        </View>
      )}

      {!loading && orders.length === 0 && (
        <View className="empty-state">
          <Text className="empty-icon">📋</Text>
          <Text className="empty-text">暂无订单</Text>
          <Text className="empty-desc">去首页下一单试试吧</Text>
          <Button className="empty-btn" onClick={goHome}>
            去下单
          </Button>
        </View>
      )}

      <View className="order-list">
        {orders.map((order) => {
          const statusInfo = statusMap[order.status] || statusMap.created;
          return (
            <View key={order.id} className="order-card">
              <View className="order-card-header">
                <Text className="order-category">{order.category || '通用服务'}</Text>
                <Text
                  className="order-status"
                  style={{ color: statusInfo.color, backgroundColor: statusInfo.bgColor }}
                >
                  {statusInfo.label}
                </Text>
              </View>

              <View className="order-card-body">
                <Text className="order-desc">{order.description || '暂无描述'}</Text>
                <View className="order-info-row">
                  <Text className="order-info-label">订单号</Text>
                  <Text className="order-info-value">#{order.id}</Text>
                </View>
                <View className="order-info-row">
                  <Text className="order-info-label">下单时间</Text>
                  <Text className="order-info-value">{formatDate(order.createdAt)}</Text>
                </View>
                {order.provider && (
                  <View className="order-info-row">
                    <Text className="order-info-label">服务师傅</Text>
                    <Text className="order-info-value">
                      {order.provider.name} · ⭐ {order.provider.rating}
                    </Text>
                  </View>
                )}
              </View>

              <View className="order-card-footer">
                <Text className="order-price">¥{order.price}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
