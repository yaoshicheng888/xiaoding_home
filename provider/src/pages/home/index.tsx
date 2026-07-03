import { useState, useEffect } from "react";
import { getStats, getIncome } from "../../api";

interface HomeProps {
  onNavigate: (page: string) => void;
}

const STATUS_MAP = {
  online: { label: "在线", color: "#22C55E", bg: "#ECFDF5" },
  offline: { label: "离线", color: "#64748B", bg: "#F1F5F9" },
  busy: { label: "忙碌", color: "#F59E0B", bg: "#FEF3C7" }
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
      const [statsRes, incomeRes] = await Promise.all([
        getStats(token),
        getIncome(token)
      ]);
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
      <div style={{ padding: "16px", textAlign: "center", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
        <div style={{ color: "#64748B" }}>加载中...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <div style={{ backgroundColor: "#2563EB", padding: "20px", paddingTop: "56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "22px", color: "#FFFFFF", fontWeight: 600, marginBottom: "8px" }}>
              小钉到家 - 师傅端
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>
              欢迎回来，师傅
            </div>
          </div>
          <div
            onClick={() => setOnline(!online)}
            style={{
              padding: "8px 20px",
              borderRadius: "20px",
              backgroundColor: STATUS_MAP[online ? "online" : "offline"].bg,
              color: STATUS_MAP[online ? "online" : "offline"].color,
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              userSelect: "none",
              transition: "all 150ms"
            }}
          >
            {STATUS_MAP[online ? "online" : "offline"].label}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "20px"
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
          }}>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "#2563EB" }}>
              {stats.todayOrders}
            </div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "8px" }}>今日接单</div>
          </div>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
          }}>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "#22C55E" }}>
              ¥{stats.todayIncome.toFixed(2)}
            </div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "8px" }}>今日收入</div>
          </div>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
          }}>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "#F59E0B" }}>
              {stats.pendingOrders}
            </div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "8px" }}>待完成</div>
          </div>
        </div>

        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
        }}>
          <div style={{ fontSize: "18px", fontWeight: 600, color: "#1E293B", marginBottom: "16px" }}>快捷入口</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            <div
              onClick={() => onNavigate("orders")}
              style={{
                padding: "24px",
                textAlign: "center",
                backgroundColor: "#EFF6FF",
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>📋</div>
              <div style={{ fontSize: "14px", color: "#1E293B", fontWeight: 500 }}>订单大厅</div>
            </div>
            <div
              onClick={() => onNavigate("my-orders")}
              style={{
                padding: "24px",
                textAlign: "center",
                backgroundColor: "#ECFDF5",
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>✅</div>
              <div style={{ fontSize: "14px", color: "#1E293B", fontWeight: 500 }}>我的订单</div>
            </div>
            <div
              onClick={() => onNavigate("income")}
              style={{
                padding: "24px",
                textAlign: "center",
                backgroundColor: "#FEF3C7",
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>💰</div>
              <div style={{ fontSize: "14px", color: "#1E293B", fontWeight: 500 }}>收入记录</div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(15,23,42,0.05)"
        }}>
          <div style={{ fontSize: "18px", fontWeight: 600, color: "#1E293B", marginBottom: "16px" }}>收入概览</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#64748B" }}>累计收入</span>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#1E293B" }}>¥{income.totalIncome.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#64748B" }}>可提现余额</span>
              <span style={{ fontSize: "18px", fontWeight: 700, color: "#22C55E" }}>¥{income.balance.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#64748B" }}>待结算金额</span>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#F59E0B" }}>¥{income.pendingIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}