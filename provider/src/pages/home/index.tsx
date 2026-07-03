import { useState, useEffect } from "react";
import { ClipboardList, CheckCircle, Wallet, Power } from "lucide-react";
import { getStats, getIncome } from "../../api";
import { Card } from "design-system";
import { colors, font, spacing, shadows, radius } from "design-system";

interface HomeProps {
  onNavigate: (page: string) => void;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  online: { label: "在线", color: colors.success, bg: `${colors.success}15` },
  offline: { label: "离线", color: colors.gray[500], bg: colors.gray[100] },
  busy: { label: "忙碌", color: colors.warning, bg: `${colors.warning}15` },
};

export default function Home({ onNavigate }: HomeProps) {
  const [stats, setStats] = useState({ todayOrders: 0, todayIncome: 0, pendingOrders: 0 });
  const [income, setIncome] = useState({ balance: 0, totalIncome: 0, settledIncome: 0, pendingIncome: 0 });
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);

  const loadData = async () => {
    const token = localStorage.getItem("provider_token");
    if (!token) return;

    setLoading(true);
    try {
      const [statsRes, incomeRes] = await Promise.all([getStats(token), getIncome(token)]);
      setStats(statsRes);
      setIncome(incomeRes);
    } catch (e) {
      console.error("加载数据失败", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: spacing.lg, textAlign: "center", minHeight: "100vh", backgroundColor: colors.gray[50] }}>
        <div style={{ color: colors.gray[500] }}>加载中...</div>
      </div>
    );
  }

  const quickEntries = [
    { key: "orders", label: "订单大厅", icon: <ClipboardList size={28} color={colors.primary[500]} />, bg: colors.primary[50] },
    { key: "my-orders", label: "我的订单", icon: <CheckCircle size={28} color={colors.success} />, bg: `${colors.success}15` },
    { key: "income", label: "收入记录", icon: <Wallet size={28} color={colors.warning} />, bg: `${colors.warning}15` },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.gray[50] }}>
      <div style={{ backgroundColor: colors.primary[500], padding: spacing.lg, paddingTop: 56 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: font.h3.size, color: colors.gray[0], fontWeight: font.h3.weight, marginBottom: spacing.sm }}>
              小钉到家 - 师傅端
            </div>
            <div style={{ fontSize: font.bodySmall.size, color: "rgba(var(--ds-white-rgb), 0.85)" }}>欢迎回来，师傅</div>
          </div>
          <div
            onClick={() => setOnline(!online)}
            style={{
              padding: `${spacing.sm}px ${spacing.lg}px`,
              borderRadius: radius.xxl,
              backgroundColor: STATUS_MAP[online ? "online" : "offline"].bg,
              color: STATUS_MAP[online ? "online" : "offline"].color,
              fontSize: font.bodySmall.size,
              fontWeight: font.title.weight,
              cursor: "pointer",
              userSelect: "none",
              transition: "all 150ms",
              display: "inline-flex",
              alignItems: "center",
              gap: spacing.xs,
            }}
          >
            <Power size={14} />
            {STATUS_MAP[online ? "online" : "offline"].label}
          </div>
        </div>
      </div>

      <div style={{ padding: spacing.lg }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: spacing.md, marginBottom: spacing.xl }}>
          <Card padding={spacing.lg} style={{ textAlign: "center", boxShadow: shadows.level1 }}>
            <div style={{ fontSize: font.h1.size, fontWeight: font.h1.weight, color: colors.primary[500] }}>{stats.todayOrders}</div>
            <div style={{ fontSize: font.caption.size, color: colors.gray[500], marginTop: spacing.sm }}>今日接单</div>
          </Card>
          <Card padding={spacing.lg} style={{ textAlign: "center", boxShadow: shadows.level1 }}>
            <div style={{ fontSize: font.h1.size, fontWeight: font.h1.weight, color: colors.success }}>¥{stats.todayIncome.toFixed(2)}</div>
            <div style={{ fontSize: font.caption.size, color: colors.gray[500], marginTop: spacing.sm }}>今日收入</div>
          </Card>
          <Card padding={spacing.lg} style={{ textAlign: "center", boxShadow: shadows.level1 }}>
            <div style={{ fontSize: font.h1.size, fontWeight: font.h1.weight, color: colors.warning }}>{stats.pendingOrders}</div>
            <div style={{ fontSize: font.caption.size, color: colors.gray[500], marginTop: spacing.sm }}>待完成</div>
          </Card>
        </div>

        <Card style={{ marginBottom: spacing.xl, boxShadow: shadows.level1 }}>
          <div style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900], marginBottom: spacing.lg }}>快捷入口</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: spacing.md }}>
            {quickEntries.map((entry) => (
              <div
                key={entry.key}
                onClick={() => onNavigate(entry.key)}
                style={{
                  padding: spacing.xl,
                  textAlign: "center",
                  backgroundColor: entry.bg,
                  borderRadius: radius.md,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                {entry.icon}
                <div style={{ fontSize: font.bodySmall.size, color: colors.gray[900], fontWeight: font.title.weight }}>{entry.label}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ boxShadow: shadows.level1 }}>
          <div style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900], marginBottom: spacing.lg }}>收入概览</div>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: colors.gray[500] }}>累计收入</span>
              <span style={{ fontSize: font.body.size, fontWeight: font.title.weight, color: colors.gray[900] }}>
                ¥{income.totalIncome.toFixed(2)}
              </span>
            </div>
            <div style={{ height: 1, backgroundColor: colors.gray[200] }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: colors.gray[500] }}>可提现余额</span>
              <span style={{ fontSize: font.h3.size, fontWeight: font.h3.weight, color: colors.success }}>
                ¥{income.balance.toFixed(2)}
              </span>
            </div>
            <div style={{ height: 1, backgroundColor: colors.gray[200] }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: colors.gray[500] }}>待结算金额</span>
              <span style={{ fontSize: font.body.size, fontWeight: font.title.weight, color: colors.warning }}>
                ¥{income.pendingIncome.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
