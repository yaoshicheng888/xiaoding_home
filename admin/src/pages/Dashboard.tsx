import { useEffect, useState } from "react";
import { Card, Row, Col, message } from "antd";
import { getStats, Stats } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch {
      message.error("获取统计数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("refresh", fetchData);
    return () => window.removeEventListener("refresh", fetchData);
  }, []);

  const cardData = [
    { key: "todayOrders", label: "今日订单", value: stats?.todayOrders || 0, color: "#1677ff" },
    { key: "todayRevenue", label: "今日成交金额", value: `¥${stats?.todayRevenue || 0}`, color: "#10b981" },
    { key: "pendingOrders", label: "待处理订单", value: stats?.pendingOrders || 0, color: "#f59e0b" },
    { key: "onlineProviders", label: "在线师傅", value: stats?.onlineProviders || 0, color: "#06b6d4" },
    { key: "abnormalOrders", label: "异常订单数量", value: stats?.abnormalOrders || 0, color: "#ef4444" },
  ];

  const trendData = [
    { day: "周一", count: 12 },
    { day: "周二", count: 18 },
    { day: "周三", count: 8 },
    { day: "周四", count: 25 },
    { day: "周五", count: 20 },
    { day: "周六", count: 30 },
    { day: "周日", count: 22 },
  ];
  const maxCount = Math.max(...trendData.map((d) => d.count));

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>控制台</h2>
      <Row gutter={[16, 16]}>
        {cardData.map((item) => (
          <Col span={4} key={item.key}>
            <Card loading={loading} hoverable style={{ borderRadius: "8px" }}>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>{item.label}</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: item.color }}>{item.value}</div>
            </Card>
          </Col>
        ))}
      </Row>
      <Card title="订单趋势（近7天）" style={{ marginTop: 24, borderRadius: "8px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", height: 200, gap: 12, padding: "0 20px" }}>
          {trendData.map((item) => (
            <div key={item.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{item.count}</div>
              <div
                style={{
                  width: "100%",
                  maxWidth: 48,
                  height: (item.count / maxCount) * 140,
                  backgroundColor: "#1677ff",
                  borderRadius: "4px 4px 0 0",
                  transition: "height 0.3s",
                }}
              />
              <div style={{ fontSize: 12, color: "#999", marginTop: 8 }}>{item.day}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
