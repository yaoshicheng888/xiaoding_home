import { useEffect, useState } from "react";
import { Table, message, Modal, Timeline, Select } from "antd";
import { Send, History } from "lucide-react";
import { getOrders, getOrderLogs, getProviders, autoDispatch, manualDispatch, Order, Provider, OrderStatusLog, statusMap } from "../api";
import { Button, Badge } from "design-system";
import { colors, font, spacing, shadows } from "design-system";

let dispatchModal: ReturnType<typeof Modal.info> | null = null;
let logsModal: ReturnType<typeof Modal.info> | null = null;

const statusBadgeMap: Record<string, { status: "warning" | "info" | "success" | "default"; label: string }> = {
  created: { status: "warning", label: "待接单" },
  assigned: { status: "info", label: "已派单" },
  accepted: { status: "info", label: "已接单" },
  doing: { status: "info", label: "服务中" },
  completed: { status: "success", label: "已完成" },
};

const getBadgeStatus = (status: string) => statusBadgeMap[status] || { status: "default" as const, label: status };

const handleViewLogs = async (order: Order) => {
  try {
    const logs = await getOrderLogs(order.id);
    logsModal = Modal.info({
      title: `订单状态流转 - #${order.id}`,
      content: (
        <div style={{ padding: spacing.xl }}>
          {logs.length === 0 ? (
            <p style={{ color: colors.gray[500], textAlign: "center", padding: `${spacing.xxl}px 0` }}>暂无状态流转记录</p>
          ) : (
            <Timeline>
              {logs.map((log: OrderStatusLog) => (
                <Timeline.Item key={log.id}>
                  <div>
                    <span style={{ color: colors.gray[500] }}>{statusMap[log.fromStatus]?.label || log.fromStatus}</span>
                    {" → "}
                    <Badge text={statusMap[log.toStatus]?.label || log.toStatus} status={getBadgeStatus(log.toStatus).status as any} />
                  </div>
                  <div style={{ fontSize: font.caption.size, color: colors.gray[400], marginTop: spacing.xxs }}>操作人: {log.operator || "系统"}</div>
                  {log.remark && <div style={{ fontSize: font.caption.size, color: colors.gray[400], marginTop: spacing.xxs }}>备注: {log.remark}</div>}
                  <div style={{ fontSize: font.caption.size, color: colors.gray[400], marginTop: spacing.xxs }}>{new Date(log.createdAt).toLocaleString("zh-CN")}</div>
                </Timeline.Item>
              ))}
            </Timeline>
          )}
        </div>
      ),
      width: 560,
      closable: true,
    });
  } catch {
    message.error("获取状态流转记录失败");
  }
};

const handleDispatch = async (order: Order) => {
  const providers = await getProviders();
  dispatchModal = Modal.info({
    title: `派单 - 订单 #${order.id}`,
    content: (
      <div style={{ padding: spacing.xl }}>
        <div style={{ marginBottom: spacing.md }}>
          <span style={{ color: colors.gray[500], fontSize: font.bodySmall.size }}>服务类目: </span>
          <span style={{ color: colors.gray[900], fontWeight: font.title.weight }}>{order.category}</span>
        </div>
        <div style={{ marginBottom: spacing.md }}>
          <span style={{ color: colors.gray[500], fontSize: font.bodySmall.size }}>问题描述: </span>
          <span style={{ color: colors.gray[900] }}>{order.description}</span>
        </div>
        <div style={{ marginBottom: spacing.xl }}>
          <span style={{ color: colors.gray[500], fontSize: font.bodySmall.size }}>金额: </span>
          <span style={{ color: colors.success, fontSize: font.h3.size, fontWeight: font.h3.weight }}>¥{order.price}</span>
        </div>
        <div style={{ display: "flex", gap: spacing.md, alignItems: "center" }}>
          <Button variant="primary" size="small" onClick={() => handleAutoDispatch(order.id)}>
            自动派单
          </Button>
          <Select
            placeholder="选择师傅手动派单"
            style={{ width: 240 }}
            options={providers.map((p: Provider) => ({ value: p.id, label: `${p.name} (${p.phone})` }))}
            onSelect={(providerId) => handleManualDispatch(order.id, providerId as number)}
          />
        </div>
      </div>
    ),
    width: 560,
    closable: true,
  });
};

const handleAutoDispatch = async (orderId: number) => {
  try {
    await autoDispatch(orderId);
    message.success("自动派单成功");
    dispatchModal?.destroy();
    window.dispatchEvent(new Event("refresh"));
  } catch {
    message.error("派单失败");
  }
};

const handleManualDispatch = async (orderId: number, providerId: number) => {
  try {
    await manualDispatch(orderId, providerId);
    message.success("手动派单成功");
    dispatchModal?.destroy();
    window.dispatchEvent(new Event("refresh"));
  } catch {
    message.error("派单失败");
  }
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch {
      message.error("获取订单失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("refresh", fetchData);
    return () => window.removeEventListener("refresh", fetchData);
  }, []);

  const columns = [
    { title: "订单号", dataIndex: "id", key: "id", render: (id: number) => <span style={{ fontWeight: font.title.weight, color: colors.primary[500] }}>#{id}</span> },
    { title: "服务类目", dataIndex: "category", key: "category", render: (val: string) => <span style={{ color: colors.gray[900], fontWeight: font.title.weight }}>{val}</span> },
    { title: "问题描述", dataIndex: "description", key: "description", ellipsis: true, render: (val: string) => <span style={{ color: colors.gray[600] }}>{val}</span> },
    { title: "客户", dataIndex: "user", key: "user", render: (user: Order["user"]) => <span style={{ color: colors.gray[900] }}>{user?.name || "-"}</span> },
    { title: "客户电话", dataIndex: "user", key: "phone", render: (user: Order["user"]) => <span style={{ color: colors.gray[500] }}>{user?.phone || "-"}</span> },
    { title: "师傅", dataIndex: "provider", key: "provider", render: (provider: Order["provider"]) => <span style={{ color: colors.gray[900] }}>{provider?.name || "-"}</span> },
    { title: "金额", dataIndex: "price", key: "price", render: (price: number) => <span style={{ color: colors.success, fontWeight: font.title.weight, fontSize: font.body.size }}>¥{price}</span> },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const info = getBadgeStatus(status);
        return <Badge text={info.label} status={info.status as any} />;
      },
    },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: colors.gray[500], fontSize: font.caption.size }}>{new Date(date).toLocaleString("zh-CN")}</span> },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Order) => (
        <div style={{ display: "flex", gap: spacing.sm }}>
          <Button variant="primary" size="small" icon={<Send size={14} />} onClick={() => handleDispatch(record)} disabled={record.status === "completed"}>
            派单
          </Button>
          <Button variant="secondary" size="small" icon={<History size={14} />} onClick={() => handleViewLogs(record)}>
            状态流转
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: spacing.xl, fontSize: font.h2.size, fontWeight: font.h2.weight, color: colors.gray[900] }}>订单管理</h2>
      <Card style={{ boxShadow: shadows.level1 }}>
        <Table columns={columns} dataSource={orders} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
