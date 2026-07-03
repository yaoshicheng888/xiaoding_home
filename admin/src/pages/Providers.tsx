import { useEffect, useState } from "react";
import { Table, Button, message, Card, Tag } from "antd";
import { getProviders, Provider } from "../api";

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProviders();
        setProviders(data);
      } catch {
        message.error("获取师傅列表失败");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", render: (val: number) => <span style={{ color: "#64748B" }}>{val}</span> },
    { title: "姓名", dataIndex: "name", key: "name", render: (val: string) => <span style={{ color: "#1E293B", fontWeight: 500 }}>{val}</span> },
    { title: "手机号", dataIndex: "phone", key: "phone", render: (val: string) => <span style={{ color: "#475569" }}>{val}</span> },
    { title: "评分", dataIndex: "rating", key: "rating", render: (val: number) => <span style={{ color: "#F59E0B", fontWeight: 600 }}>{val}分</span> },
    { title: "余额", dataIndex: "balance", key: "balance", render: (b: number) => <span style={{ color: "#22C55E", fontWeight: 600 }}>¥{b}</span> },
    { title: "注册时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: "#64748B", fontSize: 12 }}>{new Date(date).toLocaleString("zh-CN")}</span> },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Provider) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" size="small" onClick={() => message.info(`师傅 ${record.name} 上线/下线操作`)}>
            上线/下线
          </Button>
          <Button size="small" danger onClick={() => message.info(`师傅 ${record.name} 降权操作`)}>
            降权
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: "#1E293B" }}>师傅管理</h2>
      <Card style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
        <Table columns={columns} dataSource={providers} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}