import { useEffect, useState } from "react";
import { getOrders, takeOrder } from "../../api";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  created: { label: "待接单", color: "#f59e0b" },
  assigned: { label: "已派单", color: "#3b82f6" },
  accepted: { label: "已接单", color: "#10b981" },
  doing: { label: "服务中", color: "#06b6d4" },
  completed: { label: "已完成", color: "#6b7280" }
};

export default function Orders({ onDetail }: { onDetail: (id: number) => void }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "my">("available");

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

  const available = list.filter(o => o.status === "created");
  const myOrders = list.filter(o => o.status !== "created");
  const displayList = activeTab === "available" ? available : myOrders;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{
        padding: "16px 20px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
        display: "flex"
      }}>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "8px 0",
            fontSize: 16,
            color: activeTab === "available" ? "#1677ff" : "#666",
            fontWeight: activeTab === "available" ? "bold" : "normal",
            borderBottom: activeTab === "available" ? "2px solid #1677ff" : "none",
            cursor: "pointer"
          }}
          onClick={() => setActiveTab("available")}
        >
          待接单 ({available.length})
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "8px 0",
            fontSize: 16,
            color: activeTab === "my" ? "#1677ff" : "#666",
            fontWeight: activeTab === "my" ? "bold" : "normal",
            borderBottom: activeTab === "my" ? "2px solid #1677ff" : "none",
            cursor: "pointer"
          }}
          onClick={() => setActiveTab("my")}
        >
          我的订单
        </div>
      </div>

      <div style={{ padding: 12 }}>
        {loading && list.length === 0 && (
          <p style={{ textAlign: "center", color: "#999", padding: 40 }}>加载中...</p>
        )}
        {!loading && displayList.length === 0 && (
          <p style={{ textAlign: "center", color: "#999", padding: 40 }}>
            {activeTab === "available" ? "暂无待接订单" : "暂无订单"}
          </p>
        )}
        {displayList.map((item: any) => {
          const status = STATUS_MAP[item.status] || {};
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
              {item.user && (
                <p style={{ color: "#999", fontSize: 12, margin: "0 0 12px 0" }}>
                  {item.user.name} · {item.user.phone} · {item.user.city}
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#ff4d4f", fontSize: 20, fontWeight: "bold" }}>
                  ¥{item.price}
                </span>
                {item.status === "created" ? (
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
