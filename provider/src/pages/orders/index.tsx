import { useEffect, useState } from "react";
import { getOrders, takeOrder } from "../../api";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  created: { label: "待接单", color: "#F59E0B" },
  assigned: { label: "已派单", color: "#2563EB" },
  accepted: { label: "已接单", color: "#22C55E" },
  doing: { label: "服务中", color: "#06B6D4" },
  completed: { label: "已完成", color: "#64748B" }
};

const URGENCY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: "紧急", color: "#EF4444", bg: "#FEF2F2" },
  medium: { label: "较急", color: "#F97316", bg: "#FFF7ED" },
  low: { label: "普通", color: "#64748B", bg: "#F1F5F9" }
};

export default function Orders({ onDetail, onBack }: { onDetail: (id: number) => void; onBack: () => void }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("provider_token") || "";

  const load = async () => {
    setLoading(true);
    try {
      const data = await getOrders(token);
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

  const take = async (id: number) => {
    if (!confirm("确认接单？")) return;
    try {
      await takeOrder(id, token);
      alert("接单成功！");
      load();
    } catch (e: any) {
      alert(e.message || "接单失败");
    }
  };

  const displayList = list.filter(o => o.status === "created" || o.status === "assigned");

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
        <span style={{ fontSize: 18, fontWeight: 600, color: "#1E293B" }}>订单大厅</span>
      </div>

      <div style={{ padding: 16 }}>
        {loading && list.length === 0 && (
          <p style={{ textAlign: "center", color: "#94A3B8", padding: 40 }}>加载中...</p>
        )}
        {!loading && displayList.length === 0 && (
          <p style={{ textAlign: "center", color: "#94A3B8", padding: 40 }}>暂无待接订单</p>
        )}
        {displayList.map((item: any) => {
          const status = STATUS_MAP[item.status] || {};
          const urgency = URGENCY_MAP[item.urgency] || URGENCY_MAP["low"];
          const distance = item.distance || "2.5km";
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
              }}
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
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  backgroundColor: urgency.bg,
                  color: urgency.color,
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  {urgency.label}
                </span>
                <span style={{ color: "#64748B", fontSize: 12 }}>
                  📍 {distance}
                </span>
              </div>
              {item.user && (
                <p style={{ color: "#64748B", fontSize: 12, margin: "0 0 16px 0" }}>
                  {item.user.name} · {item.user.phone} · {item.user.city}
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#22C55E", fontSize: 22, fontWeight: 700 }}>
                  ¥{item.price}
                </span>
                {item.status === "created" || item.status === "assigned" ? (
                  <button
                    style={{
                      height: 44,
                      padding: "0 24px",
                      borderRadius: 12,
                      backgroundColor: "#2563EB",
                      color: "#FFFFFF",
                      fontSize: 16,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 150ms"
                    }}
                    onClick={() => take(item.id)}
                  >
                    立即接单
                  </button>
                ) : (
                  <button
                    style={{
                      height: 44,
                      padding: "0 24px",
                      borderRadius: 12,
                      backgroundColor: "#F1F5F9",
                      color: "#475569",
                      fontSize: 16,
                      fontWeight: 500,
                      border: "none",
                      cursor: "pointer"
                    }}
                    onClick={() => onDetail(item.id)}
                  >
                    查看详情
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}