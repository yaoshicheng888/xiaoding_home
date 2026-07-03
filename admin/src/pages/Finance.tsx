import { useEffect, useState } from "react";
import { Table, message, Row, Col } from "antd";
import { getPayments, Payment } from "../api";
import { Badge, Card } from "design-system";
import { colors, font, spacing, shadows } from "design-system";

const paymentBadgeMap: Record<string, { status: "warning" | "info" | "success" | "error" | "default"; label: string }> = {
  pending: { status: "warning", label: "待支付" },
  paid: { status: "info", label: "已支付" },
  settled: { status: "success", label: "已结算" },
  refunded: { status: "error", label: "已退款" },
};

const getPaymentBadge = (status: string) => paymentBadgeMap[status] || { status: "default" as const, label: status };

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
    { title: "ID", dataIndex: "id", key: "id", render: (val: number) => <span style={{ color: colors.gray[500] }}>{val}</span> },
    { title: "订单号", dataIndex: "orderId", key: "orderId", render: (id: number) => <span style={{ fontWeight: font.title.weight, color: colors.primary[500] }}>#{id}</span> },
    { title: "订单类目", dataIndex: "order", key: "orderCategory", render: (o: Payment["order"]) => <span style={{ color: colors.gray[900] }}>{o?.category || "-"}</span> },
    { title: "金额", dataIndex: "amount", key: "amount", render: (a: number) => <span style={{ color: colors.success, fontWeight: font.title.weight, fontSize: font.body.size }}>¥{a}</span> },
    { title: "平台抽成", dataIndex: "platformFee", key: "platformFee", render: (f: number) => <span style={{ color: colors.warning, fontWeight: font.title.weight }}>¥{f}</span> },
    { title: "师傅收入", dataIndex: "providerIncome", key: "providerIncome", render: (i: number) => <span style={{ color: colors.primary[500], fontWeight: font.title.weight }}>¥{i}</span> },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const info = getPaymentBadge(status);
        return <Badge text={info.label} status={info.status as any} />;
      },
    },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt", render: (date: string) => <span style={{ color: colors.gray[500], fontSize: font.caption.size }}>{new Date(date).toLocaleString("zh-CN")}</span> },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: spacing.xl, fontSize: font.h2.size, fontWeight: font.h2.weight, color: colors.gray[900] }}>财务系统</h2>
      <Row gutter={[spacing.xl, spacing.xl]} style={{ marginBottom: spacing.xl }}>
        <Col span={8}>
          <Card style={{ boxShadow: shadows.level1 }}>
            <div style={{ fontSize: font.bodySmall.size, color: colors.gray[500], marginBottom: spacing.sm }}>总成交金额</div>
            <div style={{ fontSize: font.h1.size, fontWeight: font.h1.weight, color: colors.success }}>¥{totalAmount}</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ boxShadow: shadows.level1 }}>
            <div style={{ fontSize: font.bodySmall.size, color: colors.gray[500], marginBottom: spacing.sm }}>平台总收入</div>
            <div style={{ fontSize: font.h1.size, fontWeight: font.h1.weight, color: colors.warning }}>¥{totalPlatformFee}</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ boxShadow: shadows.level1 }}>
            <div style={{ fontSize: font.bodySmall.size, color: colors.gray[500], marginBottom: spacing.sm }}>师傅总收入</div>
            <div style={{ fontSize: font.h1.size, fontWeight: font.h1.weight, color: colors.primary[500] }}>¥{totalProviderIncome}</div>
          </Card>
        </Col>
      </Row>
      <Card style={{ boxShadow: shadows.level1 }}>
        <h3 style={{ marginBottom: spacing.lg, fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900] }}>支付记录</h3>
        <Table columns={columns} dataSource={payments} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
