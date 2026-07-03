import { useEffect, useState } from "react";
import { Table, message } from "antd";
import { getUsers, User } from "../api";
import { Card } from "design-system";
import { colors, font, spacing, shadows } from "design-system";

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
    { title: "ID", dataIndex: "id", key: "id", render: (val: number) => <span style={{ color: colors.gray[500] }}>{val}</span> },
    { title: "手机号", dataIndex: "phone", key: "phone", render: (val: string) => <span style={{ color: colors.gray[600] }}>{val}</span> },
    { title: "姓名", dataIndex: "name", key: "name", render: (val: string) => <span style={{ color: colors.gray[900], fontWeight: font.title.weight }}>{val}</span> },
    { title: "注册时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: colors.gray[500], fontSize: font.caption.size }}>{new Date(date).toLocaleString("zh-CN")}</span> },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: spacing.xl, fontSize: font.h2.size, fontWeight: font.h2.weight, color: colors.gray[900] }}>用户管理</h2>
      <Card style={{ boxShadow: shadows.level1 }}>
        <Table columns={columns} dataSource={users} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
