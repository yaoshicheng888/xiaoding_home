import { useEffect, useState } from "react";
import { getOrders, takeOrder } from "../../api";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  created: { label: "待接单", color: "#f59e0b" },
  assigned: { label: "已派单", color: "#3b82f6" },
  accepted: { label: "已接单", color: "#10b981" },
  doing: { label: "服务中", color: "#06b6d4" },
  completed: { label: "已完成", color: "#6b7280" }
};

const URGENCY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: "紧急", color: "#ef4444", bg: "#fef2f2" },
  medium: { label: "较急", color: "#f97316", bg: "#fff7ed" },
  low: { label: "普通", color: "#6b7280", bg: "#f3f4f6" }
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
        <span style={{ fontSize: 16, fontWeight: "bold" }}>订单大厅</span>
      </div>

      <div style={{ padding: 12 }}>
        {loading && list.length === 0 && (
          <p style={{ textAlign: "center", color: "#999", padding: 40 }}>加载中...</p>
        )}
        {!loading && displayList.length === 0 && (
          <p style={{ textAlign: "center", color: "#999", padding: 40 }}>暂无待接订单</p>
        )}
        {displayList.map((item: any) => {
          const status = STATUS_MAP[item.status] || {};
          const urgency = URGENCY_MAP[item.urgency] || URGENCY_MAP["low"];
          const distance = item.distance || "2.5km";
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                padding: 16,
                marginBottom: 12
              }}
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{
                  padding: "2px 8px",
                  borderRadius: 4,
                  backgroundColor: urgency.bg,
                  color: urgency.color,
                  fontSize: 12,
                  fontWeight: "bold"
                }}>
                  {urgency.label}
                </span>
                <span style={{ color: "#999", fontSize: 12 }}>
                  📍 {distance}
                </span>
              </div>
              {item.user && (
                <p style={{ color: "#999", fontSize: 12, margin: "0 0 12px 0" }}>
                  {item.user.name} · {item.user.phone} · {item.user.city}
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#ff4d4f", fontSize: 20, fontWeight: "bold" }}>
                  ¥{item.price}
                </span>
                {item.status === "created" || item.status === "assigned" ? (
                  <button
                    style={{
                      height: 36,
                      padding: "0 20px",
                      borderRadius: 6,
                      backgroundColor: "#1677ff",
                      color: "#fff",
                      fontSize: 14,
                      border: "none",
                      cursor: "pointer"
                    }}
                    onClick={() => take(item.id)}
                  >
                    立即接单
                  </button>
                ) : (
                  <button
                    style={{
                      height: 36,
                      padding: "0 20px",
                      borderRadius: 6,
                      backgroundColor: "#f0f0f0",
                      color: "#333",
                      fontSize: 14,
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