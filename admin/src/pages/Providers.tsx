import { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
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
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "姓名", dataIndex: "name", key: "name" },
    { title: "手机号", dataIndex: "phone", key: "phone" },
    { title: "评分", dataIndex: "rating", key: "rating" },
    { title: "余额", dataIndex: "balance", key: "balance", render: (b: number) => `¥${b}` },
    { title: "注册时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => new Date(date).toLocaleString("zh-CN") },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Provider) => (
        <div>
          <Button type="primary" size="small" onClick={() => message.info(`师傅 ${record.name} 上线/下线操作`)} style={{ marginRight: 8 }}>
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
      <h2 style={{ marginBottom: 20 }}>师傅管理</h2>
      <Table columns={columns} dataSource={providers} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
}
