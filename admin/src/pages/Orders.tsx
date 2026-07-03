import { useEffect, useState } from "react";
import { Table, Tag, Button, message, Modal, Timeline, Select } from "antd";
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
        <div style={{ padding: 20 }}>
          {logs.length === 0 ? (
            <p>暂无状态流转记录</p>
          ) : (
            <Timeline>
              {logs.map((log: OrderStatusLog) => (
                <Timeline.Item key={log.id}>
                  <div>
                    <span style={{ color: "#666" }}>{statusMap[log.fromStatus]?.label || log.fromStatus}</span>
                    {" → "}
                    <Tag color={statusMap[log.toStatus]?.color || "gray"}>{statusMap[log.toStatus]?.label || log.toStatus}</Tag>
                  </div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>操作人: {log.operator || "系统"}</div>
                  {log.remark && <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>备注: {log.remark}</div>}
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{new Date(log.createdAt).toLocaleString("zh-CN")}</div>
                </Timeline.Item>
              ))}
            </Timeline>
          )}
        </div>
      ),
      width: 500,
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
      <div style={{ padding: 20 }}>
        <p>服务类目: {order.category}</p>
        <p>问题描述: {order.description}</p>
        <p>金额: ¥{order.price}</p>
        <div style={{ marginTop: 20 }}>
          <Button type="primary" onClick={() => handleAutoDispatch(order.id)} style={{ marginRight: 10 }}>
            自动派单
          </Button>
          <Select
            placeholder="选择师傅手动派单"
            style={{ width: 200 }}
            options={providers.map((p: Provider) => ({ value: p.id, label: `${p.name} (${p.phone})` }))}
            onSelect={(providerId) => handleManualDispatch(order.id, providerId as number)}
          />
        </div>
      </div>
    ),
    width: 500,
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
    { title: "订单号", dataIndex: "id", key: "id", render: (id: number) => `#${id}` },
    { title: "服务类目", dataIndex: "category", key: "category" },
    { title: "问题描述", dataIndex: "description", key: "description", ellipsis: true },
    { title: "客户", dataIndex: "user", key: "user", render: (user: Order["user"]) => user?.name || "-" },
    { title: "客户电话", dataIndex: "user", key: "phone", render: (user: Order["user"]) => user?.phone || "-" },
    { title: "师傅", dataIndex: "provider", key: "provider", render: (provider: Order["provider"]) => provider?.name || "-" },
    { title: "金额", dataIndex: "price", key: "price", render: (price: number) => `¥${price}` },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const info = statusMap[status] || statusMap.created;
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => new Date(date).toLocaleString("zh-CN") },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Order) => (
        <div>
          <Button type="primary" size="small" icon={<SendOutlined />} onClick={() => handleDispatch(record)} disabled={record.status === "completed"} style={{ marginRight: 8 }}>
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
      <h2 style={{ marginBottom: 20 }}>订单管理</h2>
      <Table columns={columns} dataSource={orders} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
}
