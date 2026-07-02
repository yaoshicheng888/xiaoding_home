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
      paddingTop: 80
    }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, color: "#1677ff", margin: 0 }}>师傅端</h1>
        <p style={{ fontSize: 14, color: "#999", marginTop: 8 }}>小钉到家师傅接单系统</p>
      </div>
      <input
        style={{
          width: "100%",
          height: 48,
          border: "1px solid #ddd",
          borderRadius: 8,
          paddingLeft: 16,
          fontSize: 16,
          marginBottom: 20,
          boxSizing: "border-box"
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
          height: 48,
          borderRadius: 8,
          backgroundColor: "#1677ff",
          color: "#fff",
          fontSize: 18,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1
        }}
        onClick={login}
        disabled={loading}
      >
        {loading ? "登录中..." : "登录"}
      </button>
      <p style={{ textAlign: "center", fontSize: 12, color: "#999", marginTop: 16 }}>
        输入手机号即可登录
      </p>
    </div>
  );
}
