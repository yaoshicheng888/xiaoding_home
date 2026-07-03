import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getMyOrders } from "../../api";
import { Card, Badge } from "design-system";
import { colors, font, spacing, shadows } from "design-system";

const STATUS_MAP: Record<string, { label: string; status: "success" | "info" | "default" }> = {
  accepted: { label: "已接单", status: "success" },
  doing: { label: "服务中", status: "info" },
  completed: { label: "已完成", status: "default" },
  cancelled: { label: "已取消", status: "default" }
};

const PAYMENT_MAP: Record<string, { label: string; status: "warning" | "info" | "success" | "error" }> = {
  pending: { label: "待支付", status: "warning" },
  paid: { label: "已支付", status: "info" },
  settled: { label: "已结算", status: "success" },
  refunded: { label: "已退款", status: "error" }
};

export default function MyOrders({ onDetail, onBack }: { onDetail: (id: number) => void; onBack: () => void }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "cancelled">("active");

  const token = localStorage.getItem("provider_token") || "";

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders(token);
      setList(data || []);
    } catch (e: any) {
      alert(e.message || "加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeOrders = list.filter(o => o.status === "accepted" || o.status === "doing");
  const completedOrders = list.filter(o => o.status === "completed");
  const cancelledOrders = list.filter(o => o.status === "cancelled");
  const displayList = activeTab === "active" ? activeOrders : activeTab === "completed" ? completedOrders : cancelledOrders;

  const tabs = [
    { key: "active" as const, label: "进行中", count: activeOrders.length },
    { key: "completed" as const, label: "已完成", count: completedOrders.length },
    { key: "cancelled" as const, label: "已取消", count: cancelledOrders.length },
  ];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", backgroundColor: colors.gray[50] }}>
      <div style={{
        padding: `${spacing.md}px ${spacing.lg}px`,
        backgroundColor: colors.gray[0],
        borderBottom: `1px solid ${colors.gray[200]}`,
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <span
          style={{ color: colors.primary[500], cursor: "pointer", marginRight: spacing.md, fontSize: font.body.size, fontWeight: fontWeights.medium, display: "inline-flex", alignItems: "center", gap: spacing.xs }}
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          返回
        </span>
        <span style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900] }}>我的订单</span>
      </div>

      <div style={{
        padding: `${spacing.md}px ${spacing.lg}px`,
        backgroundColor: colors.gray[0],
        display: "flex",
        borderBottom: `1px solid ${colors.gray[200]}`
      }}>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            style={{
              flex: 1,
              textAlign: "center",
              padding: `${spacing.sm}px 0`,
              fontSize: font.bodySmall.size,
              color: activeTab === tab.key ? colors.primary[500] : colors.gray[500],
              fontWeight: activeTab === tab.key ? font.title.weight : font.body.weight,
              borderBottom: activeTab === tab.key ? `2px solid ${colors.primary[500]}` : "none",
              cursor: "pointer",
              transition: "color 150ms"
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} ({tab.count})
          </div>
        ))}
      </div>

      <div style={{ padding: spacing.md }}>
        {loading && list.length === 0 && (
          <p style={{ textAlign: "center", color: colors.gray[400], padding: spacing['2xl'] }}>加载中...</p>
        )}
        {!loading && displayList.length === 0 && (
          <p style={{ textAlign: "center", color: colors.gray[400], padding: spacing['2xl'] }}>
            {activeTab === "active" ? "暂无进行中的订单" : activeTab === "completed" ? "暂无已完成订单" : "暂无已取消订单"}
          </p>
        )}
        {displayList.map((item: any) => {
          const status = STATUS_MAP[item.status] || { label: item.status, status: "default" as const };
          const payment = PAYMENT_MAP[item.paymentStatus];
          return (
            <Card
              key={item.id}
              style={{ boxShadow: shadows.level1, cursor: "pointer" }}
              onClick={() => onDetail(item.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: spacing.md, alignItems: "center" }}>
                <span style={{ fontWeight: font.title.weight, fontSize: font.body.size, color: colors.gray[900] }}>
                  {item.category}
                </span>
                <Badge text={status.label} status={status.status} />
              </div>
              <p style={{ color: colors.gray[600], fontSize: font.bodySmall.size, margin: `0 0 ${spacing.md}px 0` }}>
                {item.description}
              </p>
              {item.user && (
                <p style={{ color: colors.gray[500], fontSize: font.caption.size, margin: `0 0 ${spacing.lg}px 0` }}>
                  {item.user.name} · {item.user.phone}
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: colors.success, fontSize: font.h2.size, fontWeight: font.h2.weight }}>
                  ¥{item.price}
                </span>
                {payment && (
                  <Badge text={payment.label} status={payment.status} />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const fontWeights = {
  medium: 500,
};
