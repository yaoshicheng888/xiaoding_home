import { useState, useEffect } from "react";
import { getStats, getIncome } from "../../api";

interface HomeProps {
  onNavigate: (page: string) => void;
}

const STATUS_MAP = {
  online: { label: "在线", color: "#10b981", bg: "#ecfdf5" },
  offline: { label: "离线", color: "#6b7280", bg: "#f3f4f6" },
  busy: { label: "忙碌", color: "#f59e0b", bg: "#fffbeb" }
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
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div>加载中...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <div style={{ backgroundColor: "#1677ff", padding: "20px", paddingTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "20px", color: "#fff", fontWeight: "bold", marginBottom: "8px" }}>
              小钉到家 - 师傅端
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
              欢迎回来，师傅
            </div>
          </div>
          <div
            onClick={() => setOnline(!online)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              backgroundColor: STATUS_MAP[online ? "online" : "offline"].bg,
              color: STATUS_MAP[online ? "online" : "offline"].color,
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              userSelect: "none"
            }}
          >
            {STATUS_MAP[online ? "online" : "offline"].label}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "20px"
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            border: "1px solid #f0f0f0"
          }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1677ff" }}>
              {stats.todayOrders}
            </div>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>今日接单</div>
          </div>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            border: "1px solid #f0f0f0"
          }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#10b981" }}>
              ¥{stats.todayIncome.toFixed(2)}
            </div>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>今日收入</div>
          </div>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            border: "1px solid #f0f0f0"
          }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#f59e0b" }}>
              {stats.pendingOrders}
            </div>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>待完成</div>
          </div>
        </div>

        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
          border: "1px solid #f0f0f0"
        }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>快捷入口</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            <div
              onClick={() => onNavigate("orders")}
              style={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#f0f9ff",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📋</div>
              <div style={{ fontSize: "14px" }}>订单大厅</div>
            </div>
            <div
              onClick={() => onNavigate("my-orders")}
              style={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#ecfdf5",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
              <div style={{ fontSize: "14px" }}>我的订单</div>
            </div>
            <div
              onClick={() => onNavigate("income")}
              style={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#fffbeb",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>💰</div>
              <div style={{ fontSize: "14px" }}>收入记录</div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "16px",
          border: "1px solid #f0f0f0"
        }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>收入概览</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#666" }}>累计收入</span>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>¥{income.totalIncome.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#666" }}>可提现余额</span>
              <span style={{ fontSize: "16px", fontWeight: "bold", color: "#10b981" }}>¥{income.balance.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#666" }}>待结算金额</span>
              <span style={{ fontSize: "16px", fontWeight: "bold", color: "#f59e0b" }}>¥{income.pendingIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}