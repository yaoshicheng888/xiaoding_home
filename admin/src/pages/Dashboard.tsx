import { useEffect, useState } from "react";
import { Row, Col, message } from "antd";
import { getStats, Stats } from "../api";
import { Card } from "design-system";
import { colors, font, spacing, shadows } from "design-system";

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
    { key: "todayOrders", label: "今日订单", value: stats?.todayOrders || 0, color: colors.primary[500] },
    { key: "todayRevenue", label: "今日成交金额", value: `¥${stats?.todayRevenue || 0}`, color: colors.success },
    { key: "pendingOrders", label: "待处理订单", value: stats?.pendingOrders || 0, color: colors.warning },
    { key: "onlineProviders", label: "在线师傅", value: stats?.onlineProviders || 0, color: colors.info },
    { key: "abnormalOrders", label: "异常订单", value: stats?.abnormalOrders || 0, color: colors.danger },
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
      <h2 style={{ marginBottom: spacing.xl, fontSize: font.h2.size, fontWeight: font.h2.weight, color: colors.gray[900] }}>
        控制台
      </h2>
      <Row gutter={[spacing.xl, spacing.xl]}>
        {cardData.map((item) => (
          <Col span={4} key={item.key}>
            <Card style={{ boxShadow: shadows.level1 }}>
              <div style={{ fontSize: font.bodySmall.size, color: colors.gray[500], marginBottom: spacing.sm }}>
                {item.label}
              </div>
              <div style={{ fontSize: font.h1.size, fontWeight: font.h1.weight, color: item.color }}>
                {loading ? "-" : item.value}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Card style={{ marginTop: spacing.xxl, boxShadow: shadows.level1 }}>
        <h3 style={{ marginBottom: spacing.lg, fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900] }}>
          订单趋势（近7天）
        </h3>
        <div style={{ display: "flex", alignItems: "flex-end", height: 200, gap: spacing.lg, padding: `0 ${spacing.xl}px` }}>
          {trendData.map((item) => (
            <div key={item.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: font.bodySmall.size, fontWeight: font.title.weight, color: colors.gray[600], marginBottom: spacing.sm }}>
                {item.count}
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: 56,
                  height: (item.count / maxCount) * 140,
                  backgroundColor: colors.primary[500],
                  borderRadius: `${radius.sm}px ${radius.sm}px 0 0`,
                  transition: "height 0.3s ease-out",
                }}
              />
              <div style={{ fontSize: font.caption.size, color: colors.gray[500], marginTop: spacing.md }}>{item.day}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
