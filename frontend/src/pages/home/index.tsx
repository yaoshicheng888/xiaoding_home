import { useState, useEffect } from 'react';
import { View, Text, Input, Button, StyleSheet, ScrollView } from '@tarojs/components';
import { createRequest, createOrder, AiResult } from '../../api';
import Taro from '@tarojs/taro';

const URGENCY_MAP: Record<string, string> = {
  high: '紧急',
  medium: '中等',
  low: '普通',
};

const CATEGORY_PRICE: Record<string, number> = {
  '空调维修': 120,
  '疏通': 150,
  '水管维修': 100,
  '电路维修': 120,
  '家电维修': 100,
  '开锁': 80,
  '通用': 90,
};

export default function HomePage() {
  const [inputText, setInputText] = useState('');
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderCreating, setOrderCreating] = useState(false);

  useEffect(() => {
    const token = Taro.getStorageSync('token');
    if (!token) {
      Taro.navigateTo({ url: '/pages/login/index' });
    }
  }, []);

  const handleParse = async () => {
    if (!inputText.trim()) {
      Taro.showToast({ title: '请输入维修问题', icon: 'none' });
      return;
    }
    setLoading(true);
    try {
      const data = await createRequest(inputText.trim());
      setAiResult(data.aiResult);
      setRequestId(data.requestId);
    } catch (error) {
      Taro.showToast({ title: '解析失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!requestId) return;
    setOrderCreating(true);
    try {
      const data = await createOrder(requestId);
      Taro.showToast({ title: '下单成功', icon: 'success' });
      setTimeout(() => {
        Taro.navigateTo({ url: `/pages/order-detail/index?id=${data.orderId}` });
      }, 1000);
    } catch (error) {
      Taro.showToast({ title: '下单失败', icon: 'none' });
    } finally {
      setOrderCreating(false);
    }
  };

  const getPrice = (category: string) => {
    return CATEGORY_PRICE[category] || CATEGORY_PRICE['通用'];
  };

  return (
    <ScrollView style={styles.container} scrollY>
      <View style={styles.header}>
        <Text style={styles.title}>小钉到家</Text>
        <Text style={styles.subtitle}>AI智能维修服务</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>描述您的问题</Text>
        <Input
          style={styles.textarea}
          placeholder="例如：空调不制冷、水管漏水、马桶堵塞..."
          value={inputText}
          onChange={(e) => setInputText(e.detail.value)}
          multiline
          autoHeight
          maxlength={200}
        />
        <Button
          style={styles.parseButton}
          onClick={handleParse}
          loading={loading}
          disabled={loading}
        >
          AI智能解析
        </Button>
      </View>

      {aiResult && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI解析结果</Text>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>服务类目</Text>
            <Text style={styles.resultValue}>{aiResult.category}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>问题描述</Text>
            <Text style={styles.resultValue}>{aiResult.problem || inputText}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>紧急程度</Text>
            <Text style={styles.resultValue}>{URGENCY_MAP[aiResult.urgency] || aiResult.urgency}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>预估费用</Text>
            <Text style={styles.priceValue}>¥{getPrice(aiResult.category)}</Text>
          </View>
          <Button
            style={styles.orderButton}
            onClick={handleOrder}
            loading={orderCreating}
            disabled={orderCreating}
          >
            立即下单
          </Button>
        </View>
      )}

      <View style={styles.menu}>
        <Text style={styles.menuTitle}>热门服务</Text>
        <View style={styles.menuGrid}>
          {Object.keys(CATEGORY_PRICE).map((key) => (
            <View
              key={key}
              style={styles.menuItem}
              onClick={() => setInputText(`${key}相关问题`)}
            >
              <Text style={styles.menuName}>{key}</Text>
              <Text style={styles.menuPrice}>¥{CATEGORY_PRICE[key]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1677ff',
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  card: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  textarea: {
    height: 120,
    border: '1px solid #eee',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  parseButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1677ff',
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottom: '1px solid #f5f5f5',
  },
  resultLabel: {
    fontSize: 14,
    color: '#999',
  },
  resultValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginTop: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 24,
    color: '#ff4d4f',
    fontWeight: 'bold',
  },
  orderButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#ff4d4f',
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
  menu: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    width: '31%',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  menuName: {
    fontSize: 14,
    color: '#333',
  },
  menuPrice: {
    fontSize: 12,
    color: '#ff4d4f',
    marginTop: 4,
  },
  bottomSpace: {
    height: 100,
  },
});
