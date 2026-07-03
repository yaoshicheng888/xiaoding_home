import { useEffect, useState } from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import { getOrders, takeOrder } from "../../api";
import { Card, Button, Badge } from "design-system";
import { colors, font, spacing, shadows } from "design-system";

const STATUS_MAP: Record<string, { label: string; status: "warning" | "info" | "success" | "default" }> = {
  created: { label: "待接单", status: "warning" },
  assigned: { label: "已派单", status: "info" },
  accepted: { label: "已接单", status: "info" },
  doing: { label: "服务中", status: "info" },
  completed: { label: "已完成", status: "success" },
};

const URGENCY_MAP: Record<string, { label: string; status: "error" | "warning" | "default" }> = {
  high: { label: "紧急", status: "error" },
  medium: { label: "较急", status: "warning" },
  low: { label: "普通", status: "default" },
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

  const displayList = list.filter((o) => o.status === "created" || o.status === "assigned");

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", backgroundColor: colors.gray[50] }}>
      <div className="page-header">
        <span className="page-header-back" onClick={onBack}>
          <ArrowLeft size={18} />
          返回
        </span>
        <span className="page-header-title">订单大厅</span>
      </div>

      <div style={{ padding: spacing.lg }}>
        {loading && list.length === 0 && <p style={{ textAlign: "center", color: colors.gray[400], padding: spacing['2xl'] }}>加载中...</p>}
        {!loading && displayList.length === 0 && <p style={{ textAlign: "center", color: colors.gray[400], padding: spacing['2xl'] }}>暂无待接订单</p>}
        {displayList.map((item: any) => {
          const status = STATUS_MAP[item.status] || { label: item.status, status: "default" as const };
          const urgency = URGENCY_MAP[item.urgency] || URGENCY_MAP["low"];
          const distance = item.distance || "2.5km";
          return (
            <Card key={item.id} style={{ marginBottom: spacing.md, boxShadow: shadows.level1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: spacing.md, alignItems: "center" }}>
                <span style={{ fontWeight: font.title.weight, fontSize: font.title.size, color: colors.gray[900] }}>{item.category}</span>
                <Badge text={status.label} status={status.status as any} />
              </div>
              <p style={{ color: colors.gray[600], fontSize: font.bodySmall.size, margin: `0 0 ${spacing.md}px 0` }}>{item.description}</p>
              <div style={{ display: "flex", alignItems: "center", gap: spacing.md, marginBottom: spacing.md }}>
                <Badge text={urgency.label} status={urgency.status as any} />
                <span style={{ color: colors.gray[500], fontSize: font.caption.size, display: "inline-flex", alignItems: "center", gap: spacing.xs }}>
                  <MapPin size={14} />
                  {distance}
                </span>
              </div>
              {item.user && (
                <p style={{ color: colors.gray[500], fontSize: font.caption.size, margin: `0 0 ${spacing.lg}px 0` }}>
                  {item.user.name} · {item.user.phone} · {item.user.city}
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: colors.success, fontSize: font.h2.size, fontWeight: font.h2.weight }}>¥{item.price}</span>
                {item.status === "created" || item.status === "assigned" ? (
                  <Button variant="primary" size="small" onClick={() => take(item.id)}>
                    立即接单
                  </Button>
                ) : (
                  <Button variant="secondary" size="small" onClick={() => onDetail(item.id)}>
                    查看详情
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
