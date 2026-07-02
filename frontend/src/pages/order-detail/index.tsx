import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from '@tarojs/components';
import { getOrderDetail, Order, statusMap } from '../../api';
import Taro from '@tarojs/taro';

const STATUS_FLOW = ['created', 'assigned', 'accepted', 'doing', 'completed'];

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    const options = Taro.getCurrentInstance()?.router?.params;
    const orderId = options?.id ? Number(options.id) : 0;
    if (orderId) {
      fetchOrder(orderId);
      const t = setInterval(() => {
        fetchOrder(orderId);
      }, 5000);
      setTimer(t);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  const fetchOrder = async (orderId: number) => {
    try {
      const data = await getOrderDetail(orderId);
      setOrder(data);
    } catch (error) {
      console.error('获取订单详情失败', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getCurrentStatusIndex = () => {
    if (!order) return 0;
    return STATUS_FLOW.indexOf(order.status);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.empty}>
        <Text>订单不存在</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} scrollY>
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>订单状态</Text>
        <View style={styles.statusFlow}>
          {STATUS_FLOW.map((status, index) => {
            const isActive = index <= getCurrentStatusIndex();
            const isCurrent = index === getCurrentStatusIndex();
            return (
              <View key={status} style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: isActive ? statusMap[status]?.color : '#ddd' }]}>
                  {isCurrent && <View style={styles.statusPulse} />}
                </View>
                <Text style={[styles.statusLabel, { color: isActive ? '#333' : '#999' }]}>
                  {statusMap[status]?.label}
                </Text>
                {index < STATUS_FLOW.length - 1 && (
                  <View style={[styles.statusLine, { backgroundColor: isActive && index < getCurrentStatusIndex() ? statusMap[status]?.color : '#ddd' }]} />
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>订单信息</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>订单编号</Text>
          <Text style={styles.infoValue}>#{order.id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>服务类目</Text>
          <Text style={styles.infoValue}>{order.category || '通用服务'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>问题描述</Text>
          <Text style={styles.infoValue}>{order.description}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>订单金额</Text>
          <Text style={{ ...styles.infoValue, color: '#ff4d4f', fontWeight: 'bold', fontSize: 18 }}>
            ¥{order.price}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>创建时间</Text>
          <Text style={styles.infoValue}>{formatTime(order.createdAt)}</Text>
        </View>
      </View>

      {order.provider && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>服务师傅</Text>
          <View style={styles.providerCard}>
            <View style={styles.providerAvatar}>
              <Text style={styles.providerAvatarText}>{order.provider.name[0]}</Text>
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{order.provider.name}</Text>
              <Text style={styles.providerPhone}>{order.provider.phone}</Text>
              <Text style={styles.providerRating}>评分: {order.provider.rating}</Text>
            </View>
            <Button style={styles.callButton} onClick={() => Taro.makePhoneCall({ phoneNumber: order.provider.phone })}>
              联系
            </Button>
          </View>
        </View>
      )}

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
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statusFlow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    position: 'relative',
    zIndex: 1,
  },
  statusPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'inherit',
    opacity: 0.5,
    animation: 'pulse 2s infinite',
  },
  statusLine: {
    position: 'absolute',
    top: 12,
    left: '50%',
    right: '-50%',
    height: 2,
    zIndex: 0,
  },
  statusLabel: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottom: '1px solid #f5f5f5',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 16,
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: '#1677ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  providerAvatarText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  providerPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  providerRating: {
    fontSize: 12,
    color: '#f59e0b',
    marginTop: 4,
  },
  callButton: {
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1677ff',
    color: '#fff',
    fontSize: 14,
    padding: '0 20px',
  },
  bottomSpace: {
    height: 100,
  },
});
