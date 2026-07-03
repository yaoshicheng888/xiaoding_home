import { useEffect, useState } from "react";
import { Table, Button, message, Select, Card, Tag } from "antd";
import { getOrders, getProviders, autoDispatch, manualDispatch, Order, Provider } from "../api";

export default function Dispatch() {
  const [list, setList] = useState<Order[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const allOrders = await getOrders();
      setList(allOrders.filter((o) => o.status === "created"));
      const ps = await getProviders();
      setProviders(ps);
    } catch {
      message.error("获取待派单订单失败");
    } finally {
      setLoading(false);
    }
  };

  const dispatch = async (orderId: number, providerId?: number) => {
    try {
      if (providerId) {
        await manualDispatch(orderId, providerId);
        message.success("手动派单成功");
      } else {
        await autoDispatch(orderId);
        message.success("自动派单成功");
      }
      load();
    } catch {
      message.error("派单失败");
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("refresh", load);
    return () => window.removeEventListener("refresh", load);
  }, []);

  const columns = [
    { title: "订单ID", dataIndex: "id", key: "id", render: (id: number) => <span style={{ fontWeight: 600, color: "#2563EB" }}>#{id}</span> },
    { title: "服务类目", dataIndex: "category", key: "category", render: (val: string) => <span style={{ color: "#1E293B", fontWeight: 500 }}>{val}</span> },
    { title: "问题描述", dataIndex: "description", key: "description", ellipsis: true, render: (val: string) => <span style={{ color: "#475569" }}>{val}</span> },
    { title: "金额", dataIndex: "price", key: "price", render: (price: number) => <span style={{ color: "#22C55E", fontWeight: 600, fontSize: 16 }}>¥{price}</span> },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: "#64748B", fontSize: 12 }}>{new Date(date).toLocaleString("zh-CN")}</span> },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Order) => (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button type="primary" size="small" onClick={() => dispatch(record.id)}>
            自动派单
          </Button>
          <Select
            placeholder="选择师傅"
            style={{ width: 200 }}
            size="small"
            options={providers.map((p) => ({ value: p.id, label: `${p.name} (${p.phone})` }))}
            onSelect={(providerId) => dispatch(record.id, providerId as number)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: "#1E293B" }}>派单中心</h2>
      <div style={{ marginBottom: 20, padding: "16px 20px", backgroundColor: "#EFF6FF", borderRadius: 12, borderLeft: "4px solid #2563EB" }}>
        <p style={{ color: "#1E3A8A", fontSize: 14 }}>以下为待派单订单（状态为待派单），可自动或手动指派师傅</p>
      </div>
      <Card style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
        <Table columns={columns} dataSource={list} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}