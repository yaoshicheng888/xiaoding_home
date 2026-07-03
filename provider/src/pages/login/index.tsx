import { useState } from "react";
import { Smartphone } from "lucide-react";
import { providerLogin } from "../../api";
import { Button, Input } from "design-system";
import { colors, font, spacing, shadows, radius } from "design-system";

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xl,
        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[400]} 100%)`,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: spacing['2xl'] }}>
        <h1 style={{ fontSize: font.display.size, color: colors.gray[0], margin: 0, fontWeight: font.display.weight }}>
          师傅端
        </h1>
        <p style={{ fontSize: font.bodySmall.size, color: "rgba(var(--ds-white-rgb), 0.85)", marginTop: spacing.sm }}>
          小钉到家师傅接单系统
        </p>
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: 320,
          backgroundColor: colors.gray[0],
          borderRadius: radius.xl,
          padding: spacing['2xl'],
          boxShadow: shadows.level3,
        }}
      >
        <Input
          placeholder="请输入手机号"
          type="tel"
          maxLength={11}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          prefix={<Smartphone size={18} />}
          inputSize="large"
          style={{ marginBottom: spacing.lg }}
        />
        <Button variant="primary" size="large" block loading={loading} onClick={login}>
          {loading ? "登录中..." : "登录"}
        </Button>
        <p style={{ textAlign: "center", fontSize: font.caption.size, color: colors.gray[400], marginTop: spacing.lg }}>
          输入手机号即可登录
        </p>
      </div>
    </div>
  );
}
