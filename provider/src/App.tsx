import { useState, useEffect } from "react";
import Login from "./pages/login";
import Home from "./pages/home";
import Orders from "./pages/orders";
import MyOrders from "./pages/my-orders";
import Income from "./pages/income";
import Detail from "./pages/detail";
import "./App.css";

type Page = "login" | "home" | "orders" | "my-orders" | "income" | "detail";

function App() {
  const [page, setPage] = useState<Page>("login");
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("provider_token");
    if (token) {
      setPage("home");
    }
  }, []);

  const handleLogin = () => {
    setPage("home");
  };

  const handleNavigate = (targetPage: string) => {
    setPage(targetPage as Page);
  };

  const handleDetail = (id: number) => {
    setOrderId(id);
    setPage("detail");
  };

  const handleBack = () => {
    setPage("home");
  };

  const handleBackToHome = () => {
    setPage("home");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {page === "login" && <Login onLogin={handleLogin} />}
      {page === "home" && <Home onNavigate={handleNavigate} />}
      {page === "orders" && <Orders onDetail={handleDetail} onBack={handleBackToHome} />}
      {page === "my-orders" && <MyOrders onDetail={handleDetail} onBack={handleBackToHome} />}
      {page === "income" && <Income onBack={handleBackToHome} />}
      {page === "detail" && orderId && (
        <Detail orderId={orderId} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;