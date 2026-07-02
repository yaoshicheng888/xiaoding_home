import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Swiper } from '@tarojs/components';
import { getOrderList, Order, statusMap } from '../../api';
import Taro from '@tarojs/taro';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrderList();
      setOrders(data);
    } catch (error) {
      Taro.showToast({ title: '获取订单失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>暂无订单</Text>
        <Button
          style={styles.goHome}
          onClick={() => Taro.navigateTo({ url: '/pages/home/index' })}
        >
          去下单
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} scrollY>
      {orders.map((order) => (
        <View
          key={order.id}
          style={styles.orderCard}
          onClick={() => Taro.navigateTo({ url: `/pages/order-detail/index?id=${order.id}` })}
        >
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>订单 #${order.id}</Text>
            <Text style={{ ...styles.statusText, color: statusMap[order.status]?.color }}>
              {statusMap[order.status]?.label}
            </Text>
          </View>
          <View style={styles.orderContent}>
            <Text style={styles.category}>{order.category || '通用服务'}</Text>
            <Text style={styles.description}>{order.description}</Text>
          </View>
          <View style={styles.orderFooter}>
            <Text style={styles.price}>¥{order.price}</Text>
            <Text style={styles.time}>{formatTime(order.createdAt)}</Text>
          </View>
          {order.provider && (
            <View style={styles.providerInfo}>
              <Text style={styles.providerLabel}>服务师傅：</Text>
              <Text style={styles.providerName}>{order.provider.name}</Text>
              <Text style={styles.providerPhone}>{order.provider.phone}</Text>
            </View>
          )}
        </View>
      ))}
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  goHome: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1677ff',
    color: '#fff',
    fontSize: 16,
  },
  orderCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderContent: {
    marginBottom: 12,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.5,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4d4f',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  providerInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1px solid #f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerLabel: {
    fontSize: 12,
    color: '#999',
  },
  providerName: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginRight: 8,
  },
  providerPhone: {
    fontSize: 12,
    color: '#666',
  },
  bottomSpace: {
    height: 100,
  },
});
