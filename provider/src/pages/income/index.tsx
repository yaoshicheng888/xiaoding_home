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
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div>加载中...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{
        padding: "16px 20px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        alignItems: "center"
      }}>
        <span
          style={{ color: "#1677ff", cursor: "pointer", marginRight: 16 }}
          onClick={onBack}
        >
          ← 返回
        </span>
        <span style={{ fontSize: 16, fontWeight: "bold" }}>收入中心</span>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{
          backgroundColor: "#1677ff",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "20px"
        }}>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>
            可提现余额
          </div>
          <div style={{ fontSize: "36px", color: "#fff", fontWeight: "bold" }}>
            ¥{income.balance.toFixed(2)}
          </div>
          <button
            style={{
              marginTop: "16px",
              width: "100%",
              height: "44px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              color: "#1677ff",
              fontSize: "16px",
              border: "none",
              cursor: "pointer"
            }}
            onClick={() => alert("提现功能开发中")}
          >
            立即提现
          </button>
        </div>

        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
          border: "1px solid #f0f0f0"
        }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>收入统计</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#666" }}>累计收入</span>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>¥{income.totalIncome.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#666" }}>已结算金额</span>
              <span style={{ fontSize: "16px", fontWeight: "bold", color: "#10b981" }}>¥{income.settledIncome.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#666" }}>待结算金额</span>
              <span style={{ fontSize: "16px", fontWeight: "bold", color: "#f59e0b" }}>¥{income.pendingIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "16px",
          border: "1px solid #f0f0f0"
        }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>资金状态</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            <div style={{
              padding: "16px",
              textAlign: "center",
              backgroundColor: "#fef3c7",
              borderRadius: "8px"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>
                ¥{income.pendingIncome.toFixed(2)}
              </div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>冻结中</div>
            </div>
            <div style={{
              padding: "16px",
              textAlign: "center",
              backgroundColor: "#dbeafe",
              borderRadius: "8px"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>
                ¥{income.settledIncome.toFixed(2)}
              </div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>已结算</div>
            </div>
            <div style={{
              padding: "16px",
              textAlign: "center",
              backgroundColor: "#d1fae5",
              borderRadius: "8px"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
                ¥{income.balance.toFixed(2)}
              </div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>可提现</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}