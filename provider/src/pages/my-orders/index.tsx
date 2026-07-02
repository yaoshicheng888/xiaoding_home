import { useEffect, useState } from "react";
import { getMyOrders } from "../../api";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  accepted: { label: "已接单", color: "#10b981" },
  doing: { label: "服务中", color: "#06b6d4" },
  completed: { label: "已完成", color: "#6b7280" }
};

const PAYMENT_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "待支付", color: "#f59e0b" },
  paid: { label: "已支付", color: "#3b82f6" },
  settled: { label: "已结算", color: "#10b981" },
  refunded: { label: "已退款", color: "#ef4444" }
};

export default function MyOrders({ onDetail, onBack }: { onDetail: (id: number) => void; onBack: () => void }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

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
  const displayList = activeTab === "active" ? activeOrders : completedOrders;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{
        padding: "16px 20px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        alignItems: "center"
      }}>
        <span
          style={{ color: "#1677ff", cursor: "pointer", marginRight: 16 }}
          onClick={onBack}
        >
          ← 返回
        </span>
        <span style={{ fontSize: 16, fontWeight: "bold" }}>我的订单</span>
      </div>

      <div style={{
        padding: "16px 20px",
        backgroundColor: "#fff",
        display: "flex"
      }}>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "8px 0",
            fontSize: 16,
            color: activeTab === "active" ? "#1677ff" : "#666",
            fontWeight: activeTab === "active" ? "bold" : "normal",
            borderBottom: activeTab === "active" ? "2px solid #1677ff" : "none",
            cursor: "pointer"
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
            fontSize: 16,
            color: activeTab === "completed" ? "#1677ff" : "#666",
            fontWeight: activeTab === "completed" ? "bold" : "normal",
            borderBottom: activeTab === "completed" ? "2px solid #1677ff" : "none",
            cursor: "pointer"
          }}
          onClick={() => setActiveTab("completed")}
        >
          已完成
        </div>
      </div>

      <div style={{ padding: 12 }}>
        {loading && list.length === 0 && (
          <p style={{ textAlign: "center", color: "#999", padding: 40 }}>加载中...</p>
        )}
        {!loading && displayList.length === 0 && (
          <p style={{ textAlign: "center", color: "#999", padding: 40 }}>
            {activeTab === "active" ? "暂无进行中的订单" : "暂无已完成订单"}
          </p>
        )}
        {displayList.map((item: any) => {
          const status = STATUS_MAP[item.status] || {};
          const payment = PAYMENT_MAP[item.paymentStatus] || {};
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                padding: 16,
                marginBottom: 12
              }}
              onClick={() => onDetail(item.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: "bold", fontSize: 16 }}>
                  {item.category}
                </span>
                <span style={{ color: status.color, fontWeight: "bold" }}>
                  {status.label}
                </span>
              </div>
              <p style={{ color: "#666", fontSize: 14, margin: "0 0 8px 0" }}>
                {item.description}
              </p>
              {item.user && (
                <p style={{ color: "#999", fontSize: 12, margin: "0 0 12px 0" }}>
                  {item.user.name} · {item.user.phone}
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#ff4d4f", fontSize: 20, fontWeight: "bold" }}>
                  ¥{item.price}
                </span>
                {item.paymentStatus && (
                  <span style={{ color: payment.color, fontSize: 12 }}>
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