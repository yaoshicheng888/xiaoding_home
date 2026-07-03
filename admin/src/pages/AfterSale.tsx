import { useEffect, useState } from "react";
import { Table, message } from "antd";
import { getAfterSales, AfterSale } from "../api";
import { Button, Badge, Card } from "design-system";
import { colors, font, spacing, shadows } from "design-system";

const afterSaleBadgeMap: Record<string, { status: "warning" | "info" | "success" | "error" | "default"; label: string }> = {
  pending: { status: "warning", label: "待处理" },
  processing: { status: "info", label: "处理中" },
  resolved: { status: "success", label: "已解决" },
  rejected: { status: "error", label: "已拒绝" },
};

const getAfterSaleBadge = (status: string) => afterSaleBadgeMap[status] || { status: "default" as const, label: status };

export default function AfterSalePage() {
  const [afterSales, setAfterSales] = useState<AfterSale[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAfterSales();
        setAfterSales(data);
      } catch {
        message.error("获取售后记录失败");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", render: (val: number) => <span style={{ color: colors.gray[500] }}>{val}</span> },
    { title: "订单号", dataIndex: "orderId", key: "orderId", render: (id: number) => <span style={{ fontWeight: font.title.weight, color: colors.primary[500] }}>#{id}</span> },
    { title: "订单类目", dataIndex: "order", key: "orderCategory", render: (o: AfterSale["order"]) => <span style={{ color: colors.gray[900] }}>{o?.category || "-"}</span> },
    { title: "售后原因", dataIndex: "reason", key: "reason", ellipsis: true, render: (val: string) => <span style={{ color: colors.gray[600] }}>{val}</span> },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const info = getAfterSaleBadge(status);
        return <Badge text={info.label} status={info.status as any} />;
      },
    },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: colors.gray[500], fontSize: font.caption.size }}>{new Date(date).toLocaleString("zh-CN")}</span> },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: AfterSale) => (
        <div style={{ display: "flex", gap: spacing.sm }}>
          <Button variant="primary" size="small" onClick={() => message.info(`处理售后单 #${record.id}`)}>
            处理
          </Button>
          <Button variant="danger" size="small" onClick={() => message.info(`拒绝售后单 #${record.id}`)}>
            拒绝
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: spacing.xl, fontSize: font.h2.size, fontWeight: font.h2.weight, color: colors.gray[900] }}>售后管理</h2>
      <Card style={{ boxShadow: shadows.level1 }}>
        <Table columns={columns} dataSource={afterSales} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
