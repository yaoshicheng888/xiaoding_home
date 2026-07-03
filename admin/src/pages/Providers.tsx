import { useEffect, useState } from "react";
import { Table, message } from "antd";
import { getProviders, Provider } from "../api";
import { Button, Card } from "design-system";
import { colors, font, spacing, shadows } from "design-system";

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
    { title: "ID", dataIndex: "id", key: "id", render: (val: number) => <span style={{ color: colors.gray[500] }}>{val}</span> },
    { title: "姓名", dataIndex: "name", key: "name", render: (val: string) => <span style={{ color: colors.gray[900], fontWeight: font.title.weight }}>{val}</span> },
    { title: "手机号", dataIndex: "phone", key: "phone", render: (val: string) => <span style={{ color: colors.gray[600] }}>{val}</span> },
    { title: "评分", dataIndex: "rating", key: "rating", render: (val: number) => <span style={{ color: colors.warning, fontWeight: font.title.weight }}>{val}分</span> },
    { title: "余额", dataIndex: "balance", key: "balance", render: (b: number) => <span style={{ color: colors.success, fontWeight: font.title.weight }}>¥{b}</span> },
    { title: "注册时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: colors.gray[500], fontSize: font.caption.size }}>{new Date(date).toLocaleString("zh-CN")}</span> },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Provider) => (
        <div style={{ display: "flex", gap: spacing.sm }}>
          <Button variant="primary" size="small" onClick={() => message.info(`师傅 ${record.name} 上线/下线操作`)}>
            上线/下线
          </Button>
          <Button variant="danger" size="small" onClick={() => message.info(`师傅 ${record.name} 降权操作`)}>
            降权
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: spacing.xl, fontSize: font.h2.size, fontWeight: font.h2.weight, color: colors.gray[900] }}>师傅管理</h2>
      <Card style={{ boxShadow: shadows.level1 }}>
        <Table columns={columns} dataSource={providers} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
