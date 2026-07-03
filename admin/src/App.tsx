import { RouterProvider } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import router from "./router";
import { colors, radius } from "design-system";

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: colors.primary[500],
          colorSuccess: colors.success,
          colorWarning: colors.warning,
          colorError: colors.danger,
          colorInfo: colors.info,
          colorTextBase: colors.gray[900],
          colorBgBase: colors.gray[0],
          borderRadius: radius.md,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Button: {
            borderRadius: radius.md,
          },
          Card: {
            borderRadius: radius.xl,
          },
          Table: {
            borderRadius: radius.md,
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
