import { useState, useEffect } from "react";
import { ArrowLeft, Wallet, TrendingUp, PiggyBank, Clock, CheckCircle } from "lucide-react";
import { getIncome } from "../../api";
import { Card, Button } from "design-system";
import { colors, font, spacing, shadows, radius } from "design-system";

interface IncomeProps {
  onBack: () => void;
}

export default function Income({ onBack }: IncomeProps) {
  const [income, setIncome] = useState({ balance: 0, totalIncome: 0, settledIncome: 0, pendingIncome: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const token = localStorage.getItem("provider_token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await getIncome(token);
      setIncome(res);
    } catch (e) {
      console.error("加载收入数据失败", e);
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
        <div style={{ color: colors.gray[400] }}>加载中...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", backgroundColor: colors.gray[50] }}>
      <div style={{
        padding: `${spacing.md}px ${spacing.lg}px`,
        backgroundColor: colors.gray[0],
        borderBottom: `1px solid ${colors.gray[200]}`,
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <span
          style={{ color: colors.primary[500], cursor: "pointer", marginRight: spacing.md, fontSize: font.body.size, fontWeight: fontWeights.medium, display: "inline-flex", alignItems: "center", gap: spacing.xs }}
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          返回
        </span>
        <span style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900] }}>收入中心</span>
      </div>

      <div style={{ padding: spacing.lg }}>
        <div style={{
          backgroundColor: colors.primary[500],
          borderRadius: radius.xl,
          padding: spacing.xl,
          marginBottom: spacing.lg,
          boxShadow: shadows.level2
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: spacing.sm, fontSize: font.bodySmall.size, color: "rgba(var(--ds-white-rgb), 0.85)", marginBottom: spacing.md }}>
            <Wallet size={16} />
            可提现余额
          </div>
          <div style={{ fontSize: font.display.size, color: colors.gray[0], fontWeight: font.display.weight }}>
            ¥{income.balance.toFixed(2)}
          </div>
          <Button
            variant="secondary"
            size="large"
            block
            style={{ marginTop: spacing.lg }}
            onClick={() => alert("提现功能开发中")}
          >
            立即提现
          </Button>
        </div>

        <Card style={{ marginBottom: spacing.lg, boxShadow: shadows.level1 }}>
          <div style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900], marginBottom: spacing.lg, display: "flex", alignItems: "center", gap: spacing.sm }}>
            <TrendingUp size={20} color={colors.primary[500]} />
            收入统计
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: colors.gray[500] }}>累计收入</span>
              <span style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900] }}>¥{income.totalIncome.toFixed(2)}</span>
            </div>
            <div style={{ height: 1, backgroundColor: colors.gray[200] }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: colors.gray[500] }}>已结算金额</span>
              <span style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.success }}>¥{income.settledIncome.toFixed(2)}</span>
            </div>
            <div style={{ height: 1, backgroundColor: colors.gray[200] }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: colors.gray[500] }}>待结算金额</span>
              <span style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.warning }}>¥{income.pendingIncome.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card style={{ boxShadow: shadows.level1 }}>
          <div style={{ fontSize: font.title.size, fontWeight: font.title.weight, color: colors.gray[900], marginBottom: spacing.lg, display: "flex", alignItems: "center", gap: spacing.sm }}>
            <PiggyBank size={20} color={colors.primary[500]} />
            资金状态
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: spacing.md }}>
            <div style={{
              padding: spacing.lg,
              textAlign: "center",
              backgroundColor: `${colors.warning}15`,
              borderRadius: radius.md
            }}>
              <Clock size={20} color={colors.warning} style={{ margin: "0 auto", marginBottom: spacing.xs }} />
              <div style={{ fontSize: font.h2.size, fontWeight: font.h2.weight, color: colors.warning }}>
                ¥{income.pendingIncome.toFixed(2)}
              </div>
              <div style={{ fontSize: font.caption.size, color: colors.gray[500], marginTop: spacing.sm }}>冻结中</div>
            </div>
            <div style={{
              padding: spacing.lg,
              textAlign: "center",
              backgroundColor: colors.primary[50],
              borderRadius: radius.md
            }}>
              <CheckCircle size={20} color={colors.primary[500]} style={{ margin: "0 auto", marginBottom: spacing.xs }} />
              <div style={{ fontSize: font.h2.size, fontWeight: font.h2.weight, color: colors.primary[500] }}>
                ¥{income.settledIncome.toFixed(2)}
              </div>
              <div style={{ fontSize: font.caption.size, color: colors.gray[500], marginTop: spacing.sm }}>已结算</div>
            </div>
            <div style={{
              padding: spacing.lg,
              textAlign: "center",
              backgroundColor: `${colors.success}15`,
              borderRadius: radius.md
            }}>
              <Wallet size={20} color={colors.success} style={{ margin: "0 auto", marginBottom: spacing.xs }} />
              <div style={{ fontSize: font.h2.size, fontWeight: font.h2.weight, color: colors.success }}>
                ¥{income.balance.toFixed(2)}
              </div>
              <div style={{ fontSize: font.caption.size, color: colors.gray[500], marginTop: spacing.sm }}>可提现</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

const fontWeights = {
  medium: 500,
};
