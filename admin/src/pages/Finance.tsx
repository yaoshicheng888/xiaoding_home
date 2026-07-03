import { useEffect, useState } from "react";
import { Table, Tag, message, Card, Row, Col } from "antd";
import { getPayments, Payment, paymentStatusMap } from "../api";

export default function Finance() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPayments();
        setPayments(data);
      } catch {
        message.error("获取支付记录失败");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPlatformFee = payments.reduce((sum, p) => sum + p.platformFee, 0);
  const totalProviderIncome = payments.reduce((sum, p) => sum + p.providerIncome, 0);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", render: (val: number) => <span style={{ color: "#64748B" }}>{val}</span> },
    { title: "订单号", dataIndex: "orderId", key: "orderId", render: (id: number) => <span style={{ fontWeight: 600, color: "#2563EB" }}>#{id}</span> },
    { title: "订单类目", dataIndex: "order", key: "orderCategory", render: (o: Payment["order"]) => <span style={{ color: "#1E293B" }}>{o?.category || "-"}</span> },
    { title: "金额", dataIndex: "amount", key: "amount", render: (a: number) => <span style={{ color: "#22C55E", fontWeight: 600, fontSize: 16 }}>¥{a}</span> },
    { title: "平台抽成", dataIndex: "platformFee", key: "platformFee", render: (f: number) => <span style={{ color: "#F59E0B", fontWeight: 600 }}>¥{f}</span> },
    { title: "师傅收入", dataIndex: "providerIncome", key: "providerIncome", render: (i: number) => <span style={{ color: "#2563EB", fontWeight: 600 }}>¥{i}</span> },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const info = paymentStatusMap[status] || { color: "#94A3B8", label: status };
        return <Tag color={info.color} style={{ borderRadius: 4, padding: "2px 8px" }}>{info.label}</Tag>;
      },
    },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: "#64748B", fontSize: 12 }}>{new Date(date).toLocaleString("zh-CN")}</span> },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: "#1E293B" }}>财务系统</h2>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
            <div style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}>总成交金额</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#22C55E" }}>¥{totalAmount}</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
            <div style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}>平台总收入</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#F59E0B" }}>¥{totalPlatformFee}</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
            <div style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}>师傅总收入</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#2563EB" }}>¥{totalProviderIncome}</div>
          </Card>
        </Col>
      </Row>
      <Card style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
        <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600, color: "#1E293B" }}>支付记录</h3>
        <Table columns={columns} dataSource={payments} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}