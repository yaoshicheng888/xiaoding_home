import { useState } from "react";
import { providerLogin } from "../../api";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!phone || phone.length !== 11) {
      alert("请输入正确的手机号");
      return;
    }
    setLoading(true);
    try {
      const data = await providerLogin(phone);
      localStorage.setItem("provider_token", data.token);
      localStorage.setItem("provider_info", JSON.stringify(data.provider));
      onLogin();
    } catch (e: any) {
      alert(e.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: "0 auto",
      padding: 40,
      paddingTop: 100,
      minHeight: "100vh",
      backgroundColor: "#F8FAFC"
    }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h1 style={{ fontSize: 32, color: "#2563EB", margin: 0, fontWeight: 700 }}>师傅端</h1>
        <p style={{ fontSize: 14, color: "#64748B", marginTop: 8 }}>小钉到家师傅接单系统</p>
      </div>
      <input
        style={{
          width: "100%",
          height: 52,
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          paddingLeft: 20,
          fontSize: 16,
          marginBottom: 24,
          boxSizing: "border-box",
          backgroundColor: "#FFFFFF",
          color: "#1E293B"
        }}
        placeholder="请输入手机号"
        type="tel"
        maxLength={11}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button
        style={{
          width: "100%",
          height: 52,
          borderRadius: 14,
          backgroundColor: "#2563EB",
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: 600,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "opacity 150ms"
        }}
        onClick={login}
        disabled={loading}
      >
        {loading ? "登录中..." : "登录"}
      </button>
      <p style={{ textAlign: "center", fontSize: 12, color: "#94A3B8", marginTop: 20 }}>
        输入手机号即可登录
      </p>
    </div>
  );
}