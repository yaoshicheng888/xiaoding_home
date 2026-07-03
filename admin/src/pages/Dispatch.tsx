import { useEffect, useState } from "react";
import { Table, Button, message, Select } from "antd";
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
    { title: "订单ID", dataIndex: "id", key: "id", render: (id: number) => `#${id}` },
    { title: "服务类目", dataIndex: "category", key: "category" },
    { title: "问题描述", dataIndex: "description", key: "description", ellipsis: true },
    { title: "金额", dataIndex: "price", key: "price", render: (price: number) => `¥${price}` },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => new Date(date).toLocaleString("zh-CN") },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Order) => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button type="primary" size="small" onClick={() => dispatch(record.id)}>
            自动派单
          </Button>
          <Select
            placeholder="选择师傅"
            style={{ width: 180 }}
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
      <h2 style={{ marginBottom: 20 }}>派单中心</h2>
      <p style={{ marginBottom: 16, color: "#999" }}>
        以下为待派单订单（status=created），可自动或手动指派师傅
      </p>
      <Table columns={columns} dataSource={list} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
}
