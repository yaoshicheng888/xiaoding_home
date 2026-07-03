import { useEffect, useState } from "react";
import { getOrderDetail, startService, completeOrder } from "../../api";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  created: { label: "待接单", color: "#F59E0B" },
  assigned: { label: "已派单", color: "#2563EB" },
  accepted: { label: "已接单", color: "#22C55E" },
  doing: { label: "服务中", color: "#06B6D4" },
  completed: { label: "已完成", color: "#64748B" }
};

export default function Detail({ orderId, onBack }: { orderId: number; onBack: () => void }) {
  const [order, setOrder] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [remark, setRemark] = useState("");
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

  const status = order ? (STATUS_MAP[order.status] || { label: order.status, color: "#64748B" }) : { label: "未知", color: "#64748B" };

  if (!order) {
    return (
      <div style={{ padding: 20, textAlign: "center", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
        <p style={{ color: "#94A3B8" }}>加载中...</p>
        <button
          style={{
            marginTop: 16,
            padding: "8px 20px",
            borderRadius: 8,
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            border: "none",
            cursor: "pointer"
          }}
          onClick={onBack}
        >
          返回
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: 100, minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
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
        <span style={{ fontSize: 18, fontWeight: 600, color: "#1E293B" }}>订单详情</span>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: "#1E293B" }}>{order.category}</span>
            <span style={{
              color: status.color,
              fontWeight: 600,
              fontSize: 16,
              padding: "4px 12px",
              borderRadius: 6,
              backgroundColor: status.color === "#F59E0B" ? "#FEF3C7" : status.color === "#2563EB" ? "#EFF6FF" : status.color === "#22C55E" ? "#ECFDF5" : status.color === "#06B6D4" ? "#ECFEFF" : "#F1F5F9"
            }}>
              {status.label}
            </span>
          </div>
          <p style={{ color: "#475569", fontSize: 14, margin: "0 0 12px 0" }}>
            {order.description}
          </p>
          <p style={{ color: "#22C55E", fontSize: 24, fontWeight: 700, margin: "0" }}>
            ¥{order.price}
          </p>
        </div>

        {order.user && (
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1E293B", margin: "0 0 16px 0" }}>客户信息</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>
                姓名：{order.user.name || "-"}
              </p>
              <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>
                电话：{order.user.phone || "-"}
              </p>
              <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>
                城市：{order.user.city || "-"}
              </p>
            </div>
          </div>
        )}

        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1E293B", margin: "0 0 16px 0" }}>订单信息</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>
              订单号：#{order.id}
            </p>
            <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>
              创建时间：{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
            </p>
          </div>
        </div>

        {order.status === "doing" && (
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1E293B", margin: "0 0 16px 0" }}>上传凭证</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              {uploadedImages.map((img, idx) => (
                <div key={idx} style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  overflow: "hidden",
                  position: "relative"
                }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span
                    onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      color: "#EF4444",
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 600,
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      lineHeight: "20px",
                      textAlign: "center"
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}
              <label style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                border: "2px dashed #CBD5E1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#94A3B8",
                fontSize: 28,
                transition: "border-color 150ms"
              }}>
                +
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) {
                          setUploadedImages([...uploadedImages, ev.target.result as string]);
                        }
                      };
                      reader.readAsDataURL(file);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#475569", marginBottom: 8 }}>文字说明</div>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="请输入服务说明..."
                style={{
                  width: "100%",
                  minHeight: 100,
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  padding: 12,
                  fontSize: 14,
                  resize: "vertical",
                  boxSizing: "border-box",
                  backgroundColor: "#FAFAFA",
                  color: "#1E293B"
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        padding: "16px 20px",
        borderTop: "1px solid #E2E8F0",
        boxShadow: "0 -2px 10px rgba(15,23,42,0.05)"
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>
          {order.status === "accepted" && (
            <button
              style={{
                width: "100%",
                height: 52,
                borderRadius: 14,
                backgroundColor: "#22C55E",
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "background-color 150ms"
              }}
              onClick={handleStart}
            >
              开始上门
            </button>
          )}
          {order.status === "doing" && (
            <button
              style={{
                width: "100%",
                height: 52,
                borderRadius: 14,
                backgroundColor: "#F59E0B",
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "background-color 150ms"
              }}
              onClick={handleComplete}
            >
              完工提交
            </button>
          )}
          {order.status === "completed" && (
            <button
              style={{
                width: "100%",
                height: 52,
                borderRadius: 14,
                backgroundColor: "#E2E8F0",
                color: "#94A3B8",
                fontSize: 18,
                fontWeight: 600,
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