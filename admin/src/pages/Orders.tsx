import { useEffect, useState } from "react";
import { Table, Tag, Button, message, Modal, Timeline, Select, Card } from "antd";
import { SendOutlined, HistoryOutlined } from "@ant-design/icons";
import { getOrders, getOrderLogs, getProviders, autoDispatch, manualDispatch, Order, Provider, OrderStatusLog, statusMap } from "../api";

let dispatchModal: ReturnType<typeof Modal.info> | null = null;
let logsModal: ReturnType<typeof Modal.info> | null = null;

const handleViewLogs = async (order: Order) => {
  try {
    const logs = await getOrderLogs(order.id);
    logsModal = Modal.info({
      title: `订单状态流转 - #${order.id}`,
      content: (
        <div style={{ padding: 24 }}>
          {logs.length === 0 ? (
            <p style={{ color: "#64748B", textAlign: "center", padding: "40px 0" }}>暂无状态流转记录</p>
          ) : (
            <Timeline>
              {logs.map((log: OrderStatusLog) => (
                <Timeline.Item key={log.id}>
                  <div>
                    <span style={{ color: "#64748B" }}>{statusMap[log.fromStatus]?.label || log.fromStatus}</span>
                    {" → "}
                    <Tag color={statusMap[log.toStatus]?.color || "#94A3B8"}>{statusMap[log.toStatus]?.label || log.toStatus}</Tag>
                  </div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>操作人: {log.operator || "系统"}</div>
                  {log.remark && <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>备注: {log.remark}</div>}
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{new Date(log.createdAt).toLocaleString("zh-CN")}</div>
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
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: "#64748B", fontSize: 14 }}>服务类目: </span>
          <span style={{ color: "#1E293B", fontWeight: 500 }}>{order.category}</span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: "#64748B", fontSize: 14 }}>问题描述: </span>
          <span style={{ color: "#1E293B" }}>{order.description}</span>
        </div>
        <div style={{ marginBottom: 24 }}>
          <span style={{ color: "#64748B", fontSize: 14 }}>金额: </span>
          <span style={{ color: "#22C55E", fontSize: 18, fontWeight: 600 }}>¥{order.price}</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Button type="primary" onClick={() => handleAutoDispatch(order.id)}>
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
    { title: "订单号", dataIndex: "id", key: "id", render: (id: number) => <span style={{ fontWeight: 600, color: "#2563EB" }}>#{id}</span> },
    { title: "服务类目", dataIndex: "category", key: "category", render: (val: string) => <span style={{ color: "#1E293B", fontWeight: 500 }}>{val}</span> },
    { title: "问题描述", dataIndex: "description", key: "description", ellipsis: true, render: (val: string) => <span style={{ color: "#475569" }}>{val}</span> },
    { title: "客户", dataIndex: "user", key: "user", render: (user: Order["user"]) => <span style={{ color: "#1E293B" }}>{user?.name || "-"}</span> },
    { title: "客户电话", dataIndex: "user", key: "phone", render: (user: Order["user"]) => <span style={{ color: "#64748B" }}>{user?.phone || "-"}</span> },
    { title: "师傅", dataIndex: "provider", key: "provider", render: (provider: Order["provider"]) => <span style={{ color: "#1E293B" }}>{provider?.name || "-"}</span> },
    { title: "金额", dataIndex: "price", key: "price", render: (price: number) => <span style={{ color: "#22C55E", fontWeight: 600, fontSize: 16 }}>¥{price}</span> },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const info = statusMap[status] || statusMap.created;
        return <Tag color={info.color} style={{ borderRadius: 4, padding: "2px 8px" }}>{info.label}</Tag>;
      },
    },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: "#64748B", fontSize: 12 }}>{new Date(date).toLocaleString("zh-CN")}</span> },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Order) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" size="small" icon={<SendOutlined />} onClick={() => handleDispatch(record)} disabled={record.status === "completed"}>
            派单
          </Button>
          <Button size="small" icon={<HistoryOutlined />} onClick={() => handleViewLogs(record)}>
            状态流转
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: "#1E293B" }}>订单管理</h2>
      <Card style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
        <Table columns={columns} dataSource={orders} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}