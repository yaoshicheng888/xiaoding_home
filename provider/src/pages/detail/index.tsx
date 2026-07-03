import { useEffect, useState } from "react";
import { ArrowLeft, X, Upload, User, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { getOrderDetail, startService, completeOrder } from "../../api";
import { Card, Button, Badge } from "design-system";
import { colors, font, spacing, shadows, radius } from "design-system";

const STATUS_MAP: Record<string, { label: string; status: "warning" | "info" | "success" | "default" }> = {
  created: { label: "待接单", status: "warning" },
  assigned: { label: "已派单", status: "info" },
  accepted: { label: "已接单", status: "success" },
  doing: { label: "服务中", status: "info" },
  completed: { label: "已完成", status: "default" }
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

  const status = order ? (STATUS_MAP[order.status] || { label: order.status, status: "default" as const }) : { label: "未知", status: "default" as const };

  if (!order) {
    return (
      <div style={{ padding: spacing.lg, textAlign: "center", minHeight: "100vh", backgroundColor: colors.gray[50] }}>
        <p style={{ color: colors.gray[400] }}>加载中...</p>
        <Button variant="primary" size="small" style={{ marginTop: spacing.lg }} onClick={onBack}>
          返回
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: 100, minHeight: "100vh", backgroundColor: colors.gray[50] }}>
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
        <span style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900] }}>订单详情</span>
      </div>

      <div style={{ padding: spacing.md }}>
        <Card style={{ marginBottom: spacing.md, boxShadow: shadows.level1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: spacing.md, alignItems: "center" }}>
            <span style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900] }}>{order.category}</span>
            <Badge text={status.label} status={status.status} />
          </div>
          <p style={{ color: colors.gray[600], fontSize: font.bodySmall.size, margin: `0 0 ${spacing.md}px 0` }}>
            {order.description}
          </p>
          <p style={{ color: colors.success, fontSize: font.h2.size, fontWeight: font.h2.weight, margin: 0 }}>
            ¥{order.price}
          </p>
        </Card>

        {order.user && (
          <Card style={{ marginBottom: spacing.md, boxShadow: shadows.level1 }}>
            <h3 style={{ fontSize: font.body.size, fontWeight: font.title.weight, color: colors.gray[900], margin: `0 0 ${spacing.lg}px 0` }}>客户信息</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm }}>
              <p style={{ color: colors.gray[600], fontSize: font.bodySmall.size, margin: 0, display: "flex", alignItems: "center", gap: spacing.xs }}>
                <User size={14} color={colors.gray[400]} />
                姓名：{order.user.name || "-"}
              </p>
              <p style={{ color: colors.gray[600], fontSize: font.bodySmall.size, margin: 0, display: "flex", alignItems: "center", gap: spacing.xs }}>
                <Phone size={14} color={colors.gray[400]} />
                电话：{order.user.phone || "-"}
              </p>
              <p style={{ color: colors.gray[600], fontSize: font.bodySmall.size, margin: 0, display: "flex", alignItems: "center", gap: spacing.xs }}>
                <MapPin size={14} color={colors.gray[400]} />
                城市：{order.user.city || "-"}
              </p>
            </div>
          </Card>
        )}

        <Card style={{ marginBottom: spacing.md, boxShadow: shadows.level1 }}>
          <h3 style={{ fontSize: font.body.size, fontWeight: font.title.weight, color: colors.gray[900], margin: `0 0 ${spacing.lg}px 0` }}>订单信息</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm }}>
            <p style={{ color: colors.gray[600], fontSize: font.bodySmall.size, margin: 0, display: "flex", alignItems: "center", gap: spacing.xs }}>
              <FileText size={14} color={colors.gray[400]} />
              订单号：#{order.id}
            </p>
            <p style={{ color: colors.gray[600], fontSize: font.bodySmall.size, margin: 0, display: "flex", alignItems: "center", gap: spacing.xs }}>
              <Calendar size={14} color={colors.gray[400]} />
              创建时间：{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
            </p>
          </div>
        </Card>

        {order.status === "doing" && (
          <Card style={{ boxShadow: shadows.level1 }}>
            <h3 style={{ fontSize: font.body.size, fontWeight: font.title.weight, color: colors.gray[900], margin: `0 0 ${spacing.lg}px 0` }}>上传凭证</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: spacing.md, marginBottom: spacing.lg }}>
              {uploadedImages.map((img, idx) => (
                <div key={idx} style={{
                  width: 80,
                  height: 80,
                  borderRadius: radius.md,
                  border: `1px solid ${colors.gray[200]}`,
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
                      color: colors.danger,
                      cursor: "pointer",
                      background: colors.gray[0],
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <X size={14} />
                  </span>
                </div>
              ))}
              <label style={{
                width: 80,
                height: 80,
                borderRadius: radius.md,
                border: `2px dashed ${colors.gray[300]}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: colors.gray[400],
                transition: "border-color 150ms"
              }}>
                <Upload size={28} />
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
              <div style={{ fontSize: font.bodySmall.size, fontWeight: fontWeights.medium, color: colors.gray[600], marginBottom: spacing.sm }}>文字说明</div>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="请输入服务说明..."
                style={{
                  width: "100%",
                  minHeight: 100,
                  borderRadius: radius.md,
                  border: `1px solid ${colors.gray[200]}`,
                  padding: spacing.md,
                  fontSize: font.bodySmall.size,
                  resize: "vertical",
                  boxSizing: "border-box",
                  backgroundColor: colors.gray[50],
                  color: colors.gray[900]
                }}
              />
            </div>
          </Card>
        )}
      </div>

      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.gray[0],
        padding: `${spacing.md}px ${spacing.lg}px`,
        borderTop: `1px solid ${colors.gray[200]}`,
        boxShadow: shadows.level2
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>
          {order.status === "accepted" && (
            <Button variant="primary" size="large" block onClick={handleStart}>
              开始上门
            </Button>
          )}
          {order.status === "doing" && (
            <Button variant="primary" size="large" block onClick={handleComplete}>
              完工提交
            </Button>
          )}
          {order.status === "completed" && (
            <Button variant="secondary" size="large" block disabled>
              已完成
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const fontWeights = {
  medium: 500,
};
