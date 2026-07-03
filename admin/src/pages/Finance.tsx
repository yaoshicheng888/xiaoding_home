import { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
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

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "订单号", dataIndex: "orderId", key: "orderId", render: (id: number) => `#${id}` },
    { title: "订单类目", dataIndex: "order", key: "orderCategory", render: (o: Payment["order"]) => o?.category || "-" },
    { title: "金额", dataIndex: "amount", key: "amount", render: (a: number) => `¥${a}` },
    { title: "平台抽成", dataIndex: "platformFee", key: "platformFee", render: (f: number) => `¥${f}` },
    { title: "师傅收入", dataIndex: "providerIncome", key: "providerIncome", render: (i: number) => `¥${i}` },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const info = paymentStatusMap[status] || { color: "gray", label: status };
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => new Date(date).toLocaleString("zh-CN") },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>财务系统</h2>
      <h3 style={{ marginBottom: 16 }}>支付记录</h3>
      <Table columns={columns} dataSource={payments} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
}
