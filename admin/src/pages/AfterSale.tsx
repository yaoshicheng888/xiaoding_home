import { useEffect, useState } from "react";
import { Table, Tag, Button, message } from "antd";
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
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "订单号", dataIndex: "orderId", key: "orderId", render: (id: number) => `#${id}` },
    { title: "订单类目", dataIndex: "order", key: "orderCategory", render: (o: AfterSale["order"]) => o?.category || "-" },
    { title: "售后原因", dataIndex: "reason", key: "reason", ellipsis: true },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const info = afterSaleStatusMap[status] || { color: "gray", label: status };
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => new Date(date).toLocaleString("zh-CN") },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: AfterSale) => (
        <div>
          <Button type="primary" size="small" onClick={() => message.info(`处理售后单 #${record.id}`)} style={{ marginRight: 8 }}>
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
      <h2 style={{ marginBottom: 20 }}>售后管理</h2>
      <Table columns={columns} dataSource={afterSales} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
}
