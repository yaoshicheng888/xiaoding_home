import { useEffect, useState } from "react";
import { getOrderDetail, startService, completeOrder } from "../../api";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  created: { label: "待接单", color: "#f59e0b" },
  assigned: { label: "已派单", color: "#3b82f6" },
  accepted: { label: "已接单", color: "#10b981" },
  doing: { label: "服务中", color: "#06b6d4" },
  completed: { label: "已完成", color: "#6b7280" }
};

export default function Detail({ orderId, onBack }: { orderId: number; onBack: () => void }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("provider_token") || "";

  const load = async () => {
    try {
      const data = await getOrderDetail(orderId, token);
      setOrder(data);
    } catch (e: any) {
      alert(e.message || "加载失败");
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, [orderId]);

  const handleStart = async () => {
    if (!confirm("确认开始服务？")) return;
    try {
      await startService(orderId, token);
      alert("已开始服务");
      load();
    } catch (e: any) {
      alert(e.message || "操作失败");
    }
  };

  const handleComplete = async () => {
    if (!confirm("确认完工？")) return;
    try {
      await completeOrder(orderId, token);
      alert("完工成功！");
      load();
    } catch (e: any) {
      alert(e.message || "操作失败");
    }
  };

  const status = order ? (STATUS_MAP[order.status] || {}) : {};

  if (!order && !loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>加载中...</p>
        <button onClick={onBack}>返回</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: 80 }}>
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
        <span style={{ fontSize: 16, fontWeight: "bold" }}>订单详情</span>
      </div>

      <div style={{ padding: 12 }}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 20,
          marginBottom: 12
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 18, fontWeight: "bold" }}>{order.category}</span>
            <span style={{
              color: status.color,
              fontWeight: "bold",
              fontSize: 16
            }}>
              {status.label}
            </span>
          </div>
          <p style={{ color: "#666", fontSize: 14, margin: "0 0 8px 0" }}>
            {order.description}
          </p>
          <p style={{ color: "#ff4d4f", fontSize: 22, fontWeight: "bold", margin: "12px 0 0 0" }}>
            ¥{order.price}
          </p>
        </div>

        {order.user && (
          <div style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 20,
            marginBottom: 12
          }}>
            <h3 style={{ fontSize: 16, margin: "0 0 12px 0" }}>客户信息</h3>
            <p style={{ color: "#333", margin: "0 0 8px 0" }}>
              姓名：{order.user.name || "-"}
            </p>
            <p style={{ color: "#333", margin: "0 0 8px 0" }}>
              电话：{order.user.phone || "-"}
            </p>
            <p style={{ color: "#333", margin: 0 }}>
              城市：{order.user.city || "-"}
            </p>
          </div>
        )}

        <div style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 20
        }}>
          <h3 style={{ fontSize: 16, margin: "0 0 12px 0" }}>订单信息</h3>
          <p style={{ color: "#666", fontSize: 14, margin: "0 0 8px 0" }}>
            订单号：#{order.id}
          </p>
          <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
            创建时间：{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
          </p>
        </div>
      </div>

      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: "12px 20px",
        borderTop: "1px solid #f0f0f0",
        display: "flex",
        gap: 12
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto", width: "100%", display: "flex", gap: 12 }}>
          {order.status === "accepted" && (
            <button
              style={{
                flex: 1,
                height: 48,
                borderRadius: 8,
                backgroundColor: "#10b981",
                color: "#fff",
                fontSize: 16,
                border: "none",
                cursor: "pointer"
              }}
              onClick={handleStart}
            >
              开始服务
            </button>
          )}
          {order.status === "doing" && (
            <button
              style={{
                flex: 1,
                height: 48,
                borderRadius: 8,
                backgroundColor: "#f59e0b",
                color: "#fff",
                fontSize: 16,
                border: "none",
                cursor: "pointer"
              }}
              onClick={handleComplete}
            >
              完工提交
            </button>
          )}
          {order.status === "completed" && (
            <button
              style={{
                flex: 1,
                height: 48,
                borderRadius: 8,
                backgroundColor: "#6b7280",
                color: "#fff",
                fontSize: 16,
                border: "none",
                cursor: "default"
              }}
              disabled
            >
              已完成
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
