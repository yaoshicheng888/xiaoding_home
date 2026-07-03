import { useEffect, useState } from "react";
import { getMyOrders } from "../../api";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  accepted: { label: "已接单", color: "#22C55E" },
  doing: { label: "服务中", color: "#06B6D4" },
  completed: { label: "已完成", color: "#64748B" }
};

const PAYMENT_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "待支付", color: "#F59E0B" },
  paid: { label: "已支付", color: "#2563EB" },
  settled: { label: "已结算", color: "#22C55E" },
  refunded: { label: "已退款", color: "#EF4444" }
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

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <div style={{
        padding: "16px 20px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <span
          style={{ color: "#2563EB", cursor: "pointer", marginRight: 16, fontSize: 16, fontWeight: 500 }}
          onClick={onBack}
        >
          ← 返回
        </span>
        <span style={{ fontSize: 18, fontWeight: 600, color: "#1E293B" }}>我的订单</span>
      </div>

      <div style={{
        padding: "16px 20px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        borderBottom: "1px solid #E2E8F0"
      }}>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "8px 0",
            fontSize: 15,
            color: activeTab === "active" ? "#2563EB" : "#64748B",
            fontWeight: activeTab === "active" ? 600 : 400,
            borderBottom: activeTab === "active" ? "2px solid #2563EB" : "none",
            cursor: "pointer",
            transition: "color 150ms"
          }}
          onClick={() => setActiveTab("active")}
        >
          进行中 ({activeOrders.length})
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "8px 0",
            fontSize: 15,
            color: activeTab === "completed" ? "#2563EB" : "#64748B",
            fontWeight: activeTab === "completed" ? 600 : 400,
            borderBottom: activeTab === "completed" ? "2px solid #2563EB" : "none",
            cursor: "pointer",
            transition: "color 150ms"
          }}
          onClick={() => setActiveTab("completed")}
        >
          已完成 ({completedOrders.length})
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "8px 0",
            fontSize: 15,
            color: activeTab === "cancelled" ? "#2563EB" : "#64748B",
            fontWeight: activeTab === "cancelled" ? 600 : 400,
            borderBottom: activeTab === "cancelled" ? "2px solid #2563EB" : "none",
            cursor: "pointer",
            transition: "color 150ms"
          }}
          onClick={() => setActiveTab("cancelled")}
        >
          已取消 ({cancelledOrders.length})
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {loading && list.length === 0 && (
          <p style={{ textAlign: "center", color: "#94A3B8", padding: 40 }}>加载中...</p>
        )}
        {!loading && displayList.length === 0 && (
          <p style={{ textAlign: "center", color: "#94A3B8", padding: 40 }}>
            {activeTab === "active" ? "暂无进行中的订单" : activeTab === "completed" ? "暂无已完成订单" : "暂无已取消订单"}
          </p>
        )}
        {displayList.map((item: any) => {
          const status = STATUS_MAP[item.status] || {};
          const payment = PAYMENT_MAP[item.paymentStatus] || {};
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
                cursor: "pointer"
              }}
              onClick={() => onDetail(item.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 16, color: "#1E293B" }}>
                  {item.category}
                </span>
                <span style={{ color: status.color, fontWeight: 600, fontSize: 14 }}>
                  {status.label}
                </span>
              </div>
              <p style={{ color: "#475569", fontSize: 14, margin: "0 0 12px 0" }}>
                {item.description}
              </p>
              {item.user && (
                <p style={{ color: "#64748B", fontSize: 12, margin: "0 0 16px 0" }}>
                  {item.user.name} · {item.user.phone}
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#22C55E", fontSize: 20, fontWeight: 700 }}>
                  ¥{item.price}
                </span>
                {item.paymentStatus && (
                  <span style={{ color: payment.color, fontSize: 14, fontWeight: 500 }}>
                    {payment.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}