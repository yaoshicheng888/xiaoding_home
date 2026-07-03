import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import Dispatch from "../pages/Dispatch";
import Providers from "../pages/Providers";
import Users from "../pages/Users";
import Finance from "../pages/Finance";
import AfterSale from "../pages/AfterSale";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "orders", element: <Orders /> },
      { path: "dispatch", element: <Dispatch /> },
      { path: "users", element: <Users /> },
      { path: "providers", element: <Providers /> },
      { path: "finance", element: <Finance /> },
      { path: "aftersale", element: <AfterSale /> },
    ],
  },
]);

export default router;
