import { useEffect, useState } from "react";
import { Table, message } from "antd";
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
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "手机号", dataIndex: "phone", key: "phone" },
    { title: "姓名", dataIndex: "name", key: "name" },
    { title: "注册时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => new Date(date).toLocaleString("zh-CN") },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>用户管理</h2>
      <Table columns={columns} dataSource={users} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
}
