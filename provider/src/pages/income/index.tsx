import { useState, useEffect } from "react";
import { getIncome } from "../../api";

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
      <div style={{ padding: "20px", textAlign: "center", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
        <div style={{ color: "#94A3B8" }}>加载中...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <div style={{
        padding: "16px 20px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <span
          style={{ color: "#2563EB", cursor: "pointer", marginRight: 16, fontSize: 16, fontWeight: 500 }}
          onClick={onBack}
        >
          ← 返回
        </span>
        <span style={{ fontSize: 18, fontWeight: 600, color: "#1E293B" }}>收入中心</span>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{
          backgroundColor: "#2563EB",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "20px",
          boxShadow: "0 4px 16px rgba(37,99,235,0.2)"
        }}>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", marginBottom: "12px" }}>
            可提现余额
          </div>
          <div style={{ fontSize: "40px", color: "#FFFFFF", fontWeight: 700 }}>
            ¥{income.balance.toFixed(2)}
          </div>
          <button
            style={{
              marginTop: "20px",
              width: "100%",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",
              color: "#2563EB",
              fontSize: "16px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "background-color 150ms"
            }}
            onClick={() => alert("提现功能开发中")}
          >
            立即提现
          </button>
        </div>

        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
        }}>
          <div style={{ fontSize: "18px", fontWeight: 600, color: "#1E293B", marginBottom: "16px" }}>收入统计</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#64748B" }}>累计收入</span>
              <span style={{ fontSize: "18px", fontWeight: 600, color: "#1E293B" }}>¥{income.totalIncome.toFixed(2)}</span>
            </div>
            <div style={{ height: 1, backgroundColor: "#E2E8F0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#64748B" }}>已结算金额</span>
              <span style={{ fontSize: "18px", fontWeight: 600, color: "#22C55E" }}>¥{income.settledIncome.toFixed(2)}</span>
            </div>
            <div style={{ height: 1, backgroundColor: "#E2E8F0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#64748B" }}>待结算金额</span>
              <span style={{ fontSize: "18px", fontWeight: 600, color: "#F59E0B" }}>¥{income.pendingIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
        }}>
          <div style={{ fontSize: "18px", fontWeight: 600, color: "#1E293B", marginBottom: "16px" }}>资金状态</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            <div style={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#FEF3C7",
              borderRadius: "12px"
            }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#F59E0B" }}>
                ¥{income.pendingIncome.toFixed(2)}
              </div>
              <div style={{ fontSize: "12px", color: "#64748B", marginTop: "8px" }}>冻结中</div>
            </div>
            <div style={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#EFF6FF",
              borderRadius: "12px"
            }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#2563EB" }}>
                ¥{income.settledIncome.toFixed(2)}
              </div>
              <div style={{ fontSize: "12px", color: "#64748B", marginTop: "8px" }}>已结算</div>
            </div>
            <div style={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#ECFDF5",
              borderRadius: "12px"
            }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#22C55E" }}>
                ¥{income.balance.toFixed(2)}
              </div>
              <div style={{ fontSize: "12px", color: "#64748B", marginTop: "8px" }}>可提现</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}