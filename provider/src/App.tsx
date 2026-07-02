import { useState, useEffect } from "react";
import Login from "./pages/login";
import Orders from "./pages/orders";
import Detail from "./pages/detail";
import "./App.css";

type Page = "login" | "orders" | "detail";

function App() {
  const [page, setPage] = useState<Page>("login");
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("provider_token");
    if (token) {
      setPage("orders");
    }
  }, []);

  const handleLogin = () => {
    setPage("orders");
  };

  const handleDetail = (id: number) => {
    setOrderId(id);
    setPage("detail");
  };

  const handleBack = () => {
    setPage("orders");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {page === "login" && <Login onLogin={handleLogin} />}
      {page === "orders" && <Orders onDetail={handleDetail} />}
      {page === "detail" && orderId && (
        <Detail orderId={orderId} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
