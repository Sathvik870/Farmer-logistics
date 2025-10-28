import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import LoginPage from "./pages/admin/AgentLoginPage";
import Signup from "./pages/admin/AgentSignupPage";
import Dashboard from "./pages/admin/Dashboard";
import ProductsPage from "./pages/admin/ProductsPage";
import RootRedirect from "./pages/RootRedirect";

import MainLayout from "./layouts/admin/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PurchaseOrdersPage from "./pages/admin/PurchaseOrdersPage";

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/agentlogin" element={<LoginPage />} />
            <Route path="/agentsignup" element={<Signup />} />
            {/* ProtectedRoutes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route
                  path="/purchase-orders"
                  element={<PurchaseOrdersPage />}
                />
              </Route>
            </Route>
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
