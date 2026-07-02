import { useState, useEffect } from 'react';
import { Layout, Menu, Table, Tag, Button, Modal, Select, message, Timeline, Card, Row, Col } from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  SendOutlined, 
  HistoryOutlined,
  DashboardOutlined,
  WalletOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { 
  Order, 
  Provider, 
  OrderStatusLog, 
  Stats,
  Payment,
  AfterSale,
  User,
  getOrders, 
  getProviders, 
  autoDispatch, 
  manualDispatch, 
  getOrderLogs,
  getStats,
  getPayments,
  getAfterSales,
  getUsers
} from './api';

const { Header, Content, Sider } = Layout;

const statusMap: Record<string, { color: string; label: string }> = {
  created: { color: 'orange', label: '待接单' },
  assigned: { color: 'blue', label: '已派单' },
  accepted: { color: 'green', label: '已接单' },
  doing: { color: 'cyan', label: '服务中' },
  completed: { color: 'gray', label: '已完成' },
};

const paymentStatusMap: Record<string, { color: string; label: string }> = {
  pending: { color: 'orange', label: '待支付' },
  paid: { color: 'blue', label: '已支付' },
  settled: { color: 'green', label: '已结算' },
  refunded: { color: 'red', label: '已退款' },
};

const afterSaleStatusMap: Record<string, { color: string; label: string }> = {
  pending: { color: 'orange', label: '待处理' },
  processing: { color: 'blue', label: '处理中' },
  resolved: { color: 'green', label: '已解决' },
  rejected: { color: 'red', label: '已拒绝' },
};

const orderColumns = [
  { title: '订单号', dataIndex: 'id', key: 'id', render: (id: number) => `#${id}` },
  { title: '服务类目', dataIndex: 'category', key: 'category' },
  { title: '问题描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '客户', dataIndex: 'user', key: 'user', render: (user: Order['user']) => user?.name || '-' },
  { title: '客户电话', dataIndex: 'user', key: 'phone', render: (user: Order['user']) => user?.phone || '-' },
  { title: '师傅', dataIndex: 'provider', key: 'provider', render: (provider: Order['provider']) => provider?.name || '-' },
  { title: '金额', dataIndex: 'price', key: 'price', render: (price: number) => `¥${price}` },
  { 
    title: '状态', 
    dataIndex: 'status', 
    key: 'status', 
    render: (status: string) => {
      const info = statusMap[status] || statusMap.created;
      return <Tag color={info.color}>{info.label}</Tag>;
    }
  },
  { 
    title: '创建时间', 
    dataIndex: 'createdAt', 
    key: 'createdAt',
    render: (date: string) => new Date(date).toLocaleString('zh-CN')
  },
  { 
    title: '操作',
    key: 'action',
    render: (_: unknown, record: Order) => (
      <div>
        <Button 
          type="primary" 
          size="small" 
          icon={<SendOutlined />}
          onClick={() => handleDispatch(record)}
          disabled={record.status === 'completed'}
          style={{ marginRight: 8 }}
        >
          派单
        </Button>
        <Button 
          size="small" 
          icon={<HistoryOutlined />}
          onClick={() => handleViewLogs(record)}
        >
          状态流转
        </Button>
      </div>
    ),
  },
];

const providerColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '评分', dataIndex: 'rating', key: 'rating' },
  { title: '余额', dataIndex: 'balance', key: 'balance', render: (b: number) => `¥${b}` },
  { 
    title: '注册时间', 
    dataIndex: 'createdAt', 
    key: 'createdAt',
    render: (date: string) => new Date(date).toLocaleString('zh-CN')
  },
];

const paymentColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '订单号', dataIndex: 'orderId', key: 'orderId', render: (id: number) => `#${id}` },
  { title: '订单类目', dataIndex: 'order', key: 'orderCategory', render: (o: Order | undefined) => o?.category || '-' },
  { title: '金额', dataIndex: 'amount', key: 'amount', render: (a: number) => `¥${a}` },
  { title: '平台抽成', dataIndex: 'platformFee', key: 'platformFee', render: (f: number) => `¥${f}` },
  { title: '师傅收入', dataIndex: 'providerIncome', key: 'providerIncome', render: (i: number) => `¥${i}` },
  { 
    title: '状态', 
    dataIndex: 'status', 
    key: 'status', 
    render: (status: string) => {
      const info = paymentStatusMap[status] || { color: 'gray', label: status };
      return <Tag color={info.color}>{info.label}</Tag>;
    }
  },
  { 
    title: '创建时间', 
    dataIndex: 'createdAt', 
    key: 'createdAt',
    render: (date: string) => new Date(date).toLocaleString('zh-CN')
  },
];

const afterSaleColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '订单号', dataIndex: 'orderId', key: 'orderId', render: (id: number) => `#${id}` },
  { title: '订单类目', dataIndex: 'order', key: 'orderCategory', render: (o: Order | undefined) => o?.category || '-' },
  { title: '售后原因', dataIndex: 'reason', key: 'reason', ellipsis: true },
  { 
    title: '状态', 
    dataIndex: 'status', 
    key: 'status', 
    render: (status: string) => {
      const info = afterSaleStatusMap[status] || { color: 'gray', label: status };
      return <Tag color={info.color}>{info.label}</Tag>;
    }
  },
  { 
    title: '创建时间', 
    dataIndex: 'createdAt', 
    key: 'createdAt',
    render: (date: string) => new Date(date).toLocaleString('zh-CN')
  },
];

const userColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { 
    title: '注册时间', 
    dataIndex: 'createdAt', 
    key: 'createdAt',
    render: (date: string) => new Date(date).toLocaleString('zh-CN')
  },
];

let dispatchModal: ReturnType<typeof Modal.info> | null = null;
let logsModal: ReturnType<typeof Modal.info> | null = null;

const handleViewLogs = async (order: Order) => {
  try {
    const logs = await getOrderLogs(order.id);
    
    logsModal = Modal.info({
      title: `订单状态流转 - #${order.id}`,
      content: (
        <div style={{ padding: 20 }}>
          {logs.length === 0 ? (
            <p>暂无状态流转记录</p>
          ) : (
            <Timeline>
              {logs.map((log) => (
                <Timeline.Item key={log.id}>
                  <div>
                    <span style={{ color: '#666' }}>
                      {statusMap[log.fromStatus]?.label || log.fromStatus}
                    </span>
                    {' → '}
                    <Tag color={statusMap[log.toStatus]?.color || 'gray'}>
                      {statusMap[log.toStatus]?.label || log.toStatus}
                    </Tag>
                  </div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                    操作人: {log.operator || '系统'}
                  </div>
                  {log.remark && (
                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                      备注: {log.remark}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                    {new Date(log.createdAt).toLocaleString('zh-CN')}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          )}
        </div>
      ),
      width: 500,
      closable: true,
    });
  } catch (e) {
    message.error('获取状态流转记录失败');
  }
};

const handleDispatch = async (order: Order) => {
  const providers = await getProviders();
  
  dispatchModal = Modal.info({
    title: `派单 - 订单 #${order.id}`,
    content: (
      <div style={{ padding: 20 }}>
        <p>服务类目: {order.category}</p>
        <p>问题描述: {order.description}</p>
        <p>金额: ¥{order.price}</p>
        <div style={{ marginTop: 20 }}>
          <Button type="primary" onClick={() => handleAutoDispatch(order.id)} style={{ marginRight: 10 }}>
            自动派单
          </Button>
          <Select
            placeholder="选择师傅手动派单"
            style={{ width: 200 }}
            options={providers.map(p => ({ value: p.id, label: `${p.name} (${p.phone})` }))}
            onSelect={(providerId) => handleManualDispatch(order.id, providerId as number)}
          />
        </div>
      </div>
    ),
    width: 500,
    closable: true,
  });
};

const handleAutoDispatch = async (orderId: number) => {
  try {
    await autoDispatch(orderId);
    message.success('自动派单成功');
    dispatchModal?.destroy();
    window.dispatchEvent(new Event('refresh'));
  } catch (e) {
    message.error('派单失败');
  }
};

const handleManualDispatch = async (orderId: number, providerId: number) => {
  try {
    await manualDispatch(orderId, providerId);
    message.success('手动派单成功');
    dispatchModal?.destroy();
    window.dispatchEvent(new Event('refresh'));
  } catch (e) {
    message.error('派单失败');
  }
};

function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch (e) {
      message.error('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('refresh', fetchData);
    return () => window.removeEventListener('refresh', fetchData);
  }, []);

  const cardData = [
    { key: 'todayOrders', label: '今日订单', value: stats?.todayOrders || 0, color: '#1677ff' },
    { key: 'todayRevenue', label: '今日成交金额', value: `¥${stats?.todayRevenue || 0}`, color: '#10b981' },
    { key: 'pendingOrders', label: '待处理订单', value: stats?.pendingOrders || 0, color: '#f59e0b' },
    { key: 'onlineProviders', label: '在线师傅', value: stats?.onlineProviders || 0, color: '#06b6d4' },
    { key: 'abnormalOrders', label: '异常订单数量', value: stats?.abnormalOrders || 0, color: '#ef4444' },
  ];

  const trendData = [
    { day: '周一', count: 12 },
    { day: '周二', count: 18 },
    { day: '周三', count: 8 },
    { day: '周四', count: 25 },
    { day: '周五', count: 20 },
    { day: '周六', count: 30 },
    { day: '周日', count: 22 },
  ];
  const maxCount = Math.max(...trendData.map(d => d.count));

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>控制台</h2>
      <Row gutter={[16, 16]}>
        {cardData.map((item) => (
          <Col span={4} key={item.key}>
            <Card 
              loading={loading}
              hoverable
              style={{ borderRadius: '8px' }}
            >
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: item.color }}>
                {item.value}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Card title="订单趋势（近7天）" style={{ marginTop: 24, borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 12, padding: '0 20px' }}>
          {trendData.map((item) => (
            <div key={item.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{item.count}</div>
              <div
                style={{
                  width: '100%',
                  maxWidth: 48,
                  height: (item.count / maxCount) * 140,
                  backgroundColor: '#1677ff',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s',
                }}
              />
              <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>{item.day}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (e) {
      message.error('获取订单失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('refresh', fetchData);
    return () => window.removeEventListener('refresh', fetchData);
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>订单管理</h2>
      <Table
        columns={orderColumns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

function ProviderPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProviders();
        setProviders(data);
      } catch (e) {
        message.error('获取师傅列表失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const providerColumnsWithAction = [
    ...providerColumns,
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Provider) => (
        <div>
          <Button
            type="primary"
            size="small"
            onClick={() => message.info(`师傅 ${record.name} 上线/下线操作`)}
            style={{ marginRight: 8 }}
          >
            上线/下线
          </Button>
          <Button
            size="small"
            danger
            onClick={() => message.info(`师傅 ${record.name} 降权操作`)}
          >
            降权
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>师傅管理</h2>
      <Table
        columns={providerColumnsWithAction}
        dataSource={providers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (e) {
        message.error('获取用户列表失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>用户管理</h2>
      <Table
        columns={userColumns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

function FinancePage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPayments();
        setPayments(data);
      } catch (e) {
        message.error('获取支付记录失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>财务系统</h2>
      <h3 style={{ marginBottom: 16 }}>支付记录</h3>
      <Table
        columns={paymentColumns}
        dataSource={payments}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

function AfterSalePage() {
  const [afterSales, setAfterSales] = useState<AfterSale[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAfterSales();
        setAfterSales(data);
      } catch (e) {
        message.error('获取售后记录失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const afterSaleColumnsWithAction = [
    ...afterSaleColumns,
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: AfterSale) => (
        <div>
          <Button
            type="primary"
            size="small"
            onClick={() => message.info(`处理售后单 #${record.id}`)}
            style={{ marginRight: 8 }}
          >
            处理
          </Button>
          <Button
            size="small"
            danger
            onClick={() => message.info(`拒绝售后单 #${record.id}`)}
          >
            拒绝
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>售后管理</h2>
      <Table
        columns={afterSaleColumnsWithAction}
        dataSource={afterSales}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '控制台', title: '控制台' },
  { key: 'orders', icon: <ShoppingCartOutlined />, label: '订单管理', title: '订单管理' },
  { key: 'users', icon: <UserOutlined />, label: '用户管理', title: '用户管理' },
  { key: 'providers', icon: <FileTextOutlined />, label: '师傅管理', title: '师傅管理' },
  { key: 'finance', icon: <WalletOutlined />, label: '财务系统', title: '财务系统' },
  { key: 'aftersale', icon: <FileTextOutlined />, label: '售后管理', title: '售后管理' },
];

const renderPage = (key: string) => {
  switch (key) {
    case 'dashboard':
      return <DashboardPage />;
    case 'orders':
      return <OrderPage />;
    case 'users':
      return <UserPage />;
    case 'providers':
      return <ProviderPage />;
    case 'finance':
      return <FinancePage />;
    case 'aftersale':
      return <AfterSalePage />;
    default:
      return <DashboardPage />;
  }
};

export default function App() {
  const [selectedKey, setSelectedKey] = useState('dashboard');

  const currentItem = menuItems.find(item => item.key === selectedKey);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ padding: '16px', fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
          小钉到家管理后台
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {currentItem?.title || '控制台'}
          </span>
        </Header>
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          {renderPage(selectedKey)}
        </Content>
      </Layout>
    </Layout>
  );
}