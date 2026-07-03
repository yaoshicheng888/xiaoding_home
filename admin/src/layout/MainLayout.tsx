import { Layout, Menu } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SendOutlined,
  WalletOutlined,
  FileTextOutlined,
  ToolOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

const menuItems = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "控制台" },
  { key: "/orders", icon: <ShoppingCartOutlined />, label: "订单管理" },
  { key: "/dispatch", icon: <SendOutlined />, label: "派单中心" },
  { key: "/users", icon: <UserOutlined />, label: "用户管理" },
  { key: "/providers", icon: <ToolOutlined />, label: "师傅管理" },
  { key: "/finance", icon: <WalletOutlined />, label: "财务系统" },
  { key: "/aftersale", icon: <FileTextOutlined />, label: "售后管理" },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentItem = menuItems.find((item) => location.pathname.startsWith(item.key));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} theme="light" style={{ background: "#FFFFFF", borderRight: "1px solid #E2E8F0" }}>
        <div style={{ padding: "20px 24px", fontSize: "20px", fontWeight: 600, textAlign: "left", color: "#2563EB" }}>
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
            background: "#FFFFFF",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #E2E8F0",
            height: 64,
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 600, color: "#1E293B" }}>{currentItem?.label || "控制台"}</span>
        </Header>
        <Content style={{ padding: "32px", background: "#F8FAFC" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}