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
      <Sider width={200} theme="light">
        <div style={{ padding: "16px", fontSize: "20px", fontWeight: "bold", textAlign: "center" }}>
          小钉到家管理后台
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentItem?.key || "/dashboard"]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>{currentItem?.label || "控制台"}</span>
        </Header>
        <Content style={{ padding: "24px", background: "#f5f5f5" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
