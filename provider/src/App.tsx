import { useState, useEffect } from 'react';
import {
  login,
  getAvailableOrders,
  takeOrder,
  startService,
  completeService,
  Order,
  ProviderInfo,
  statusMap,
} from './api';
import './App.css';

type Page = 'login' | 'orders' | 'order-detail';

function LoginPage({ onLogin }: { onLogin: (user: ProviderInfo) => void }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || phone.length !== 11) {
      alert('请输入正确的手机号');
      return;
    }
    setLoading(true);
    try {
      const data = await login(phone);
      localStorage.setItem('provider_token', data.token);
      localStorage.setItem('provider', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <h1>小钉到家</h1>
        <p>师傅端</p>
      </div>
      <div className="login-form">
        <div className="form-group">
          <label>手机号</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="请输入手机号"
            maxLength={11}
          />
        </div>
        <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
        <p className="login-tip">输入手机号即可登录</p>
      </div>
    </div>
  );
}

function OrdersPage({
  orders,
  onOrderClick,
  onRefresh,
}: {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onRefresh: () => void;
}) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>待接订单</h2>
        <button className="btn btn-secondary" onClick={onRefresh}>
          刷新
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>暂无待接订单</p>
          <button className="btn btn-primary" onClick={onRefresh}>
            刷新试试
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              key={order.id}
              className="order-card"
              onClick={() => onOrderClick(order)}
            >
              <div className="order-header">
                <span className="order-id">订单 #{order.id}</span>
                <span className="order-status" style={{ color: statusMap[order.status]?.color }}>
                  {statusMap[order.status]?.label}
                </span>
              </div>
              <div className="order-content">
                <div className="order-category">{order.category || '通用服务'}</div>
                <div className="order-description">{order.description}</div>
              </div>
              <div className="order-footer">
                <span className="order-price">¥{order.price}</span>
                <span className="order-time">{formatTime(order.createdAt)}</span>
              </div>
              {order.user && (
                <div className="order-user">
                  <span>客户：{order.user.name}</span>
                  <span>{order.user.phone}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderDetailPage({
  order,
  onBack,
  onAction,
}: {
  order: Order;
  onBack: () => void;
  onAction: (action: 'take' | 'start' | 'complete') => void;
}) {
  const [remark, setRemark] = useState('');

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getActionButton = () => {
    switch (order.status) {
      case 'created':
      case 'assigned':
        return {
          text: '接单',
          action: 'take' as const,
          color: '#10b981',
        };
      case 'accepted':
        return {
          text: '开始服务',
          action: 'start' as const,
          color: '#3b82f6',
        };
      case 'doing':
        return {
          text: '完成服务',
          action: 'complete' as const,
          color: '#10b981',
        };
      default:
        return null;
    }
  };

  const actionBtn = getActionButton();

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button className="btn btn-back" onClick={onBack}>
          ← 返回
        </button>
        <h2>订单详情</h2>
      </div>

      <div className="status-flow">
        {['created', 'assigned', 'accepted', 'doing', 'completed'].map((status, index) => {
          const isActive = order.status === status || ['created', 'assigned', 'accepted', 'doing', 'completed'].indexOf(order.status) >= index;
          const isCurrent = order.status === status;
          return (
            <div key={status} className="status-item">
              <div className="status-dot" style={{ backgroundColor: isActive ? statusMap[status]?.color : '#ddd' }}>
                {isCurrent && <div className="status-pulse" />}
              </div>
              <span className="status-label" style={{ color: isActive ? '#333' : '#999' }}>
                {statusMap[status]?.label}
              </span>
              {index < 4 && (
                <div className="status-line" style={{ backgroundColor: isActive && order.status !== status ? statusMap[status]?.color : '#ddd' }} />
              )}
            </div>
          );
        })}
      </div>

      <div className="info-card">
        <h3>订单信息</h3>
        <div className="info-row">
          <span className="info-label">订单编号</span>
          <span className="info-value">#{order.id}</span>
        </div>
        <div className="info-row">
          <span className="info-label">服务类目</span>
          <span className="info-value">{order.category || '通用服务'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">问题描述</span>
          <span className="info-value">{order.description}</span>
        </div>
        <div className="info-row">
          <span className="info-label">订单金额</span>
          <span className="info-value price">¥{order.price}</span>
        </div>
        <div className="info-row">
          <span className="info-label">创建时间</span>
          <span className="info-value">{formatTime(order.createdAt)}</span>
        </div>
      </div>

      {order.user && (
        <div className="info-card">
          <h3>客户信息</h3>
          <div className="user-info">
            <div className="user-avatar">{order.user.name[0]}</div>
            <div className="user-details">
              <div className="user-name">{order.user.name}</div>
              <div className="user-phone">{order.user.phone}</div>
              {order.user.city && <div className="user-city">{order.user.city}</div>}
            </div>
          </div>
        </div>
      )}

      {actionBtn && (
        <div className="action-card">
          {actionBtn.action === 'complete' && (
            <div className="remark-input">
              <label>服务备注（选填）</label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="请输入服务备注..."
              />
            </div>
          )}
          <button
            className="btn btn-action"
            style={{ backgroundColor: actionBtn.color }}
            onClick={() => onAction(actionBtn.action)}
          >
            {actionBtn.text}
          </button>
        </div>
      )}

      {!actionBtn && order.status === 'completed' && (
        <div className="completed-card">
          <p>服务已完成</p>
          <button className="btn btn-primary" onClick={onBack}>
            返回列表
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [user, setUser] = useState<ProviderInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('provider_token');
    const provider = localStorage.getItem('provider');
    if (token && provider) {
      setUser(JSON.parse(provider));
      setPage('orders');
      fetchOrders();
    }
  }, []);

  useEffect(() => {
    if (page === 'orders') {
      const t = window.setInterval(fetchOrders, 5000);
      setTimer(t);
      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [page]);

  const fetchOrders = async () => {
    try {
      const data = await getAvailableOrders();
      setOrders(data);
    } catch (error) {
      console.error('获取订单失败', error);
    }
  };

  const handleLogin = (userData: ProviderInfo) => {
    setUser(userData);
    setPage('orders');
    fetchOrders();
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setPage('order-detail');
  };

  const handleBack = () => {
    setPage('orders');
    setSelectedOrder(null);
    fetchOrders();
  };

  const handleAction = async (action: 'take' | 'start' | 'complete') => {
    if (!selectedOrder) return;

    const confirmMsg = {
      take: '确认接单？',
      start: '确认开始服务？',
      complete: '确认完成服务？',
    };

    if (!confirm(confirmMsg[action])) return;

    setLoading(true);
    try {
      switch (action) {
        case 'take':
          await takeOrder(selectedOrder.id);
          alert('接单成功');
          break;
        case 'start':
          await startService(selectedOrder.id);
          alert('开始服务');
          break;
        case 'complete':
          await completeService(selectedOrder.id);
          alert('服务完成');
          break;
      }
      handleBack();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('provider_token');
    localStorage.removeItem('provider');
    setUser(null);
    setPage('login');
  };

  return (
    <div className="app-container">
      {page === 'login' && <LoginPage onLogin={handleLogin} />}
      {page === 'orders' && user && (
        <>
          <header className="main-header">
            <div className="header-left">
              <h1>小钉到家</h1>
              <span className="header-sub">师傅端</span>
            </div>
            <div className="header-right">
              <span className="user-info">{user.name}</span>
              <button className="btn btn-logout" onClick={handleLogout}>
                退出
              </button>
            </div>
          </header>
          <OrdersPage orders={orders} onOrderClick={handleOrderClick} onRefresh={fetchOrders} />
        </>
      )}
      {page === 'order-detail' && selectedOrder && (
        <OrderDetailPage order={selectedOrder} onBack={handleBack} onAction={handleAction} />
      )}
    </div>
  );
}
