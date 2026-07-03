import { useEffect, useState } from "react";
import { Table, message, Card } from "antd";
import { getUsers, User } from "../api";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch {
        message.error("获取用户列表失败");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", render: (val: number) => <span style={{ color: "#64748B" }}>{val}</span> },
    { title: "手机号", dataIndex: "phone", key: "phone", render: (val: string) => <span style={{ color: "#475569" }}>{val}</span> },
    { title: "姓名", dataIndex: "name", key: "name", render: (val: string) => <span style={{ color: "#1E293B", fontWeight: 500 }}>{val}</span> },
    { title: "注册时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: "#64748B", fontSize: 12 }}>{new Date(date).toLocaleString("zh-CN")}</span> },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, color: "#1E293B" }}>用户管理</h2>
      <Card style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
        <Table columns={columns} dataSource={users} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}