import { Layout, Menu } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Send,
  Wallet,
  FileText,
  Wrench,
} from "lucide-react";
import { colors, font, spacing, radius } from "design-system";

const { Header, Content, Sider } = Layout;

const menuItems = [
  { key: "/dashboard", icon: <LayoutDashboard size={18} />, label: "控制台" },
  { key: "/orders", icon: <ShoppingCart size={18} />, label: "订单管理" },
  { key: "/dispatch", icon: <Send size={18} />, label: "派单中心" },
  { key: "/users", icon: <Users size={18} />, label: "用户管理" },
  { key: "/providers", icon: <Wrench size={18} />, label: "师傅管理" },
  { key: "/finance", icon: <Wallet size={18} />, label: "财务系统" },
  { key: "/aftersale", icon: <FileText size={18} />, label: "售后管理" },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentItem = menuItems.find((item) => location.pathname.startsWith(item.key));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={240}
        theme="light"
        style={{
          background: colors.gray[0],
          borderRight: `1px solid ${colors.gray[200]}`,
        }}
      >
        <div
          style={{
            padding: `${spacing.lg}px ${spacing.xl}px`,
            fontSize: font.h3.size,
            fontWeight: font.h3.weight,
            textAlign: "left",
            color: colors.primary[500],
          }}
        >
          小钉到家
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentItem?.key || "/dashboard"]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: "none" }}
          theme="light"
          defaultOpenKeys={["/dashboard"]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: colors.gray[0],
            padding: `0 ${spacing.xxl}px`,
            display: "flex",
            alignItems: "center",
            borderBottom: `1px solid ${colors.gray[200]}`,
            height: 64,
          }}
        >
          <span
            style={{
              fontSize: font.h3.size,
              fontWeight: font.h3.weight,
              color: colors.gray[900],
            }}
          >
            {currentItem?.label || "控制台"}
          </span>
        </Header>
        <Content
          style={{
            padding: `${spacing.xxl}px`,
            background: colors.gray[50],
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
