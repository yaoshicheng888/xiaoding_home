import { useEffect, useState } from "react";
import { Table, Tag, Button, message, Card } from "antd";
import { getAfterSales, AfterSale, afterSaleStatusMap } from "../api";

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
    { title: "ID", dataIndex: "id", key: "id", render: (val: number) => <span style={{ color: "#64748B" }}>{val}</span> },
    { title: "订单号", dataIndex: "orderId", key: "orderId", render: (id: number) => <span style={{ fontWeight: 600, color: "#2563EB" }}>#{id}</span> },
    { title: "订单类目", dataIndex: "order", key: "orderCategory", render: (o: AfterSale["order"]) => <span style={{ color: "#1E293B" }}>{o?.category || "-"}</span> },
    { title: "售后原因", dataIndex: "reason", key: "reason", ellipsis: true, render: (val: string) => <span style={{ color: "#475569" }}>{val}</span> },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const info = afterSaleStatusMap[status] || { color: "#94A3B8", label: status };
        return <Tag color={info.color} style={{ borderRadius: 4, padding: "2px 8px" }}>{info.label}</Tag>;
      },
    },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: "#64748B", fontSize: 12 }}>{new Date(date).toLocaleString("zh-CN")}</span> },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: AfterSale) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" size="small" onClick={() => message.info(`处理售后单 #${record.id}`)}>
            处理
          </Button>
          <Button size="small" danger onClick={() => message.info(`拒绝售后单 #${record.id}`)}>
            拒绝
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: "#1E293B" }}>售后管理</h2>
      <Card style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
        <Table columns={columns} dataSource={afterSales} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}