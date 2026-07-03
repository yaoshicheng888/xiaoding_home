import { useEffect, useState } from "react";
import { Table, message, Select } from "antd";
import { getOrders, getProviders, autoDispatch, manualDispatch, Order, Provider } from "../api";
import { Button, Card } from "design-system";
import { colors, font, spacing, shadows, radius } from "design-system";

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
    { title: "订单ID", dataIndex: "id", key: "id", render: (id: number) => <span style={{ fontWeight: font.title.weight, color: colors.primary[500] }}>#{id}</span> },
    { title: "服务类目", dataIndex: "category", key: "category", render: (val: string) => <span style={{ color: colors.gray[900], fontWeight: font.title.weight }}>{val}</span> },
    { title: "问题描述", dataIndex: "description", key: "description", ellipsis: true, render: (val: string) => <span style={{ color: colors.gray[600] }}>{val}</span> },
    { title: "金额", dataIndex: "price", key: "price", render: (price: number) => <span style={{ color: colors.success, fontWeight: font.title.weight, fontSize: font.body.size }}>¥{price}</span> },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: colors.gray[500], fontSize: font.caption.size }}>{new Date(date).toLocaleString("zh-CN")}</span> },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Order) => (
        <div style={{ display: "flex", gap: spacing.md, alignItems: "center" }}>
          <Button variant="primary" size="small" onClick={() => dispatch(record.id)}>
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
      <h2 style={{ marginBottom: spacing.xl, fontSize: font.h2.size, fontWeight: font.h2.weight, color: colors.gray[900] }}>派单中心</h2>
      <div
        style={{
          marginBottom: spacing.xl,
          padding: `${spacing.lg}px ${spacing.xl}px`,
          backgroundColor: colors.primary[50],
          borderRadius: radius.md,
          borderLeft: `4px solid ${colors.primary[500]}`,
        }}
      >
        <p style={{ color: colors.primary[800], fontSize: font.bodySmall.size }}>以下为待派单订单（状态为待派单），可自动或手动指派师傅</p>
      </div>
      <Card style={{ boxShadow: shadows.level1 }}>
        <Table columns={columns} dataSource={list} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
